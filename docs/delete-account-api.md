# Delete account (hard delete) — backend API contract

> **Implemented** in the backend repo: `src/controllers/accountController.ts`
> (`hardDeleteUserData` and `deleteAccount`), routed in `src/routes/authRoutes.ts`.
> It deletes, in one transaction: `Tournament`, `TournamentTeam`, `TournamentMatch`,
> `SavedPlayerTeam`, `PlayerIdentity`, `Player`, `SavedMatch`, `AnalyticsEvent` (by `userId`
> and by every `sessionId` the user was signed in on), `OtpVerification` (by phone), and
> finally `User`. Auth is stateless JWT, so there's no session collection to delete.
> Tokens die because `requireAuth` rejects a token whose user no longer exists.

The app's **Account Settings → Delete account** flow
(`src/components/DeleteAccountSection.tsx`, `AuthService.deleteAccount`) calls one endpoint.
The endpoint must **hard delete** the user and every record they own. That means the rows or
documents are physically removed, with no `deletedAt` / `isDeleted` / `status: "deleted"` flags
and no anonymised copies kept "just in case".

Both stores require this. Apple Guideline 5.1.1(v) requires in-app account deletion for any app
that lets users create an account. Google Play requires the same, plus a web URL, which is
`https://www.cricket-score-counter.com/delete-account`.

## Endpoint

```
DELETE /api/v1/auth/account
Authorization: Bearer <access token>
Content-Type: application/json
```

### Request body

```json
{ "confirmation": "DELETE", "password": "current-password" }
```

| Field          | Required | Notes |
|----------------|----------|-------|
| `confirmation` | yes      | Must equal the literal string `"DELETE"`. Reject anything else with 400. |
| `password`     | only if the user has a password | Verify against the stored hash. Google-only or phone-OTP accounts without a password don't send it. |

### Responses

| Status | When | Body |
|--------|------|------|
| `200`  | Account and all data deleted | `{ "deleted": true }` |
| `400`  | `confirmation` missing or wrong | `{ "message": "Type DELETE to confirm." }` |
| `403`  | Password required but missing, or wrong | `{ "message": "Incorrect password." }` |
| `401`  | Missing or expired access token | normal auth error |
| `429`  | Rate limited (suggest 5 attempts / 15 min per user) | `{ "message": "Too many attempts. Try again later." }` |
| `500`  | Deletion failed; **nothing** was deleted (transaction rolled back) | `{ "message": "We couldn't delete your account. Please try again." }` |

> **Use 403, not 401, for a wrong password.** The app treats 401 as "access token expired":
> it calls `/auth/refresh` and retries, which would hide the real error.

`message` is shown to the user verbatim, so keep it short and human-readable.

## What must be deleted

Delete everything keyed to the user's id, in **one database transaction**, so a failure halfway
leaves nothing half-deleted. The app's API surface implies at least these collections; adjust
names to match the actual schema, and add any collection that stores `userId`, `ownerId` or
`createdBy`:

| Data | Typical collection | Endpoint it backs |
|------|--------------------|-------------------|
| User profile: name, email, phone, password hash, avatar, Google `sub` | `users` | `/auth/*` |
| Refresh tokens / sessions on every device | `sessions`, `refreshtokens` | `/auth/refresh`, `/auth/logout` |
| Password-reset and OTP records | `otps`, `passwordresets` | `/auth/mobile/*`, `/auth/reset-password` |
| Saved matches and match history | `matches` | `/matches` |
| Tournaments, fixtures and results the user created | `tournaments` (+ embedded or child fixtures) | `/tournaments` |
| Saved teams and player lists | `playerteams`, `players` | `/player-teams`, `/players` |
| Player stats recorded under the user | `stats` / `playermatches` | `/stats` |
| Analytics events linked to the user | `analyticsevents` | `/analytics/track` — delete rows with this `userId` (or set `userId` to null if events are only kept as anonymous aggregates) |
| Uploaded files (avatars, team logos) | object storage | delete the objects, not just the DB reference |

Also:

- **Invalidate access tokens.** Deleting sessions stops refresh, but an already-issued JWT stays
  valid until it expires. Make the auth middleware reject a token whose user no longer exists, so
  it returns 401.
- **Live games.** If a live game owned by the user is in socket.io memory or Redis, end it and
  drop its state.
- **Google.** Optionally revoke the stored Google token
  (`POST https://oauth2.googleapis.com/revoke?token=...`) if you keep one. Not required.
- **Idempotency.** If the user is already gone (for example, a retry after a network drop), return
  `200 { "deleted": true }`, not 404.
- **Backups.** Hard delete covers the live database. If you keep database backups, the Privacy
  Policy should say how long backups are retained before they roll off. Restores must not bring
  deleted users back. Re-run deletions after any restore.
- **Logs.** Don't log the password. You can log `user <id> deleted account` for audit purposes,
  but not the email or name.

## Reference implementation (Express + Mongoose)

```js
// routes/auth.js
router.delete("/account", requireAuth, rateLimit({ windowMs: 15 * 60e3, max: 5 }), async (req, res) => {
  if (req.body?.confirmation !== "DELETE") {
    return res.status(400).json({ message: "Type DELETE to confirm." });
  }

  const user = await User.findById(req.user.id).select("+passwordHash");
  if (!user) return res.json({ deleted: true }); // idempotent

  if (user.passwordHash) {
    const ok = req.body?.password && (await bcrypt.compare(req.body.password, user.passwordHash));
    if (!ok) return res.status(403).json({ message: "Incorrect password." });
  }

  const userId = user._id;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const byUser = { $or: [{ userId }, { ownerId: userId }, { createdBy: userId }] };
      await Promise.all([
        Session.deleteMany({ userId }, { session }),
        Otp.deleteMany({ $or: [{ userId }, { email: user.email }, { phone: user.phone }] }, { session }),
        Match.deleteMany(byUser, { session }),
        Tournament.deleteMany(byUser, { session }),
        PlayerTeam.deleteMany(byUser, { session }),
        Player.deleteMany(byUser, { session }),
        Stat.deleteMany(byUser, { session }),
        AnalyticsEvent.deleteMany({ userId }, { session }),
      ]);
      await User.deleteOne({ _id: userId }, { session });
    });
  } catch (err) {
    console.error("delete account failed", userId.toString(), err.message);
    return res.status(500).json({ message: "We couldn't delete your account. Please try again." });
  } finally {
    await session.endSession();
  }

  // Outside the transaction: external resources.
  await Promise.allSettled([
    user.avatarKey ? storage.deleteObject(user.avatarKey) : null,
    liveGames.endAllForOwner(userId),
  ]);

  console.info("user deleted account", userId.toString());
  return res.json({ deleted: true });
});
```

MongoDB transactions require a replica set. Atlas clusters already run as one. On a standalone
local server, run the same deletes sequentially and delete the user document **last**.

## Client behaviour (already implemented)

1. A password user must enter their password. Every user must type `DELETE`.
2. On `200`, the app clears its session, wipes all `cricket*` keys from local and session
   storage (matches, teams, the in-progress game, caches), signs out of native Google Sign-In,
   and shows an "Account deleted" screen.
3. On an error, the dialog stays open and shows `message`.
