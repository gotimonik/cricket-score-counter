# Sign in with Apple (iOS app) — backend API contract

> **Implemented** in the backend repo: `src/utils/appleAuth.ts` (token verification, code
> exchange, revoke), `appleLogin` in `src/controllers/authController.ts`, routed in
> `src/routes/authRoutes.ts`; revoke on delete in `src/controllers/accountController.ts`.
> User fields: `appleId` (the token `sub`) and `appleRefreshToken` (`select: false`).
> The app side calls it from `AuthService.loginWithApple`, `src/utils/appleSignIn.ts`,
> button in `src/components/AuthPages.tsx`.

Why: the iOS app now offers Google Sign-In again, and App Store Guideline 4.8 requires an
equivalent privacy-focused option (Sign in with Apple) whenever a third-party login is offered.
Guideline 5.1.1(v) then also requires that deleting an account **revokes the Apple tokens**.

Scope: iOS app only. The website and Android app don't show the Apple button.

## Endpoint

```
POST /api/v1/auth/apple
Content-Type: application/json
```

### Request body

```json
{
  "identityToken": "eyJraWQiOi...",
  "authorizationCode": "c1a2b3...",
  "nonce": "9f2c...raw nonce (64 hex chars)",
  "intent": "login",
  "platform": "ios",
  "name": "Virat Kohli",
  "givenName": "Virat",
  "familyName": "Kohli"
}
```

| Field               | Required | Notes |
|---------------------|----------|-------|
| `identityToken`     | yes | JWT signed by Apple. Verify it (below). |
| `authorizationCode` | yes | Single-use, valid **5 minutes**. Exchange it for a refresh token (below) and store that so you can revoke it on account deletion. |
| `nonce`             | yes | The **raw** nonce. The app passed `sha256(nonce)` (lowercase hex) to Apple, so the token's `nonce` claim must equal `sha256hex(nonce)`. |
| `intent`            | yes | `"login"` or `"signup"` — same meaning as `/auth/google`. |
| `platform`          | yes | Always `"ios"` for now. |
| `name`, `givenName`, `familyName` | no | Apple sends the name **only on the very first authorization** for this Apple ID + app, and never puts it in the token. Save it when present; never overwrite an existing name with empty. |

### Verifying `identityToken`

1. Fetch Apple's keys from `https://appleid.apple.com/auth/keys` (JWKS; cache them, refetch on
   unknown `kid`).
2. Verify the signature (RS256) with the key matching the header `kid`.
3. Check claims:
   - `iss` === `https://appleid.apple.com`
   - `aud` === `com.cricketscorecounter.mobile` (the iOS bundle ID). If the website ever gets
     Apple login, also accept its Services ID.
   - `exp` is in the future.
   - `nonce` === `sha256hex(body.nonce)`.
4. Identity: `sub` is the stable Apple user ID — the key to store (`users.appleId`, unique).
   `email` may be a private relay address (`…@privaterelay.appleid.com`); `email_verified` is
   `true`/`"true"` for Apple-issued emails. `email` may be missing on later sign-ins, so never
   rely on it to find the user — always look up by `sub` first.

### Account matching (mirror `/auth/google`)

1. User with `appleId === sub` → log in.
2. Else, if the token has a verified `email` and a user with that email exists → **link**:
   set `appleId` on that user and log in (also with `intent: "login"`; it's an existing account).
   Mark the email as verified if it wasn't.
3. Else (no account):
   - `intent: "login"` → `404 { "code": "ACCOUNT_NOT_FOUND", "message": "No account found for this Apple ID." }`.
     The app shows "Sign up first" and a Sign up button.
   - `intent: "signup"` → create the user: `name` (fallback: "Cricket Fan" or the email's local
     part), `email` (may be a relay address), `emailVerified: true`, `appleId`, no password.
     **No email OTP step** — Apple has already verified the address.

### Exchanging `authorizationCode` (store a refresh token)

```
POST https://appleid.apple.com/auth/token
Content-Type: application/x-www-form-urlencoded

client_id=com.cricketscorecounter.mobile
client_secret=<client secret JWT, below>
code=<authorizationCode>
grant_type=authorization_code
```

Store the returned `refresh_token` on the user (`users.appleRefreshToken`). If the exchange fails, still log the user in (the identity token was valid) but log the
error — revocation on delete will then fall back to "nothing to revoke".

**Client secret** = an ES256 JWT signed with the Sign in with Apple private key (`.p8`):

| Header / claim | Value |
|---|---|
| `alg` / `kid` | `ES256` / the Key ID of the `.p8` key |
| `iss` | Team ID `8A8JG3NNKM` |
| `iat` / `exp` | now / now + up to 6 months (generate per request with a short `exp`, e.g. 5 min) |
| `aud` | `https://appleid.apple.com` |
| `sub` | `com.cricketscorecounter.mobile` |

Backend env vars: `APPLE_CLIENT_ID` (comma-separated audiences), `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (the `.p8` contents),
`APPLE_CLIENT_ID=com.cricketscorecounter.mobile`.

### Responses

Same shape as `/auth/google` and `/auth/login`:

```json
200 { "token": "...", "refreshToken": "...", "user": { "id": "...", "name": "...", "email": "...", "hasPassword": false } }
```

| Status | `code` | When |
|---|---|---|
| 400 | `INVALID_REQUEST` | Missing `identityToken` / `nonce`. |
| 401 | `INVALID_APPLE_TOKEN` | Signature, `iss`, `aud`, `exp` or `nonce` check failed. |
| 404 | `ACCOUNT_NOT_FOUND` | `intent: "login"` and no matching account. **Must** include `code` so the app doesn't treat it as a missing route. |

## Account deletion — revoke Apple tokens (required)

In `DELETE /api/v1/auth/account` (see `docs/delete-account-api.md`), before deleting the user, if
`appleRefreshToken` is set:

```
POST https://appleid.apple.com/auth/revoke
Content-Type: application/x-www-form-urlencoded

client_id=com.cricketscorecounter.mobile
client_secret=<client secret JWT>
token=<appleRefreshToken>
token_type_hint=refresh_token
```

Apple returns 200 with an empty body. If it fails, log it and **still delete the account** —
never block deletion on Apple being reachable. Apple-only accounts have no password, so the delete
request has no `password` field (same as Google-only).

## Reference sketch (the real code uses `jsonwebtoken` + Node `crypto`, no `jose`)

```ts
// src/services/appleAuth.ts
import { createRemoteJWKSet, jwtVerify, SignJWT, importPKCS8 } from "jose";
import crypto from "crypto";

const APPLE_ISSUER = "https://appleid.apple.com";
const CLIENT_ID = process.env.APPLE_CLIENT_ID ?? "com.cricketscorecounter.mobile";
const jwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

export const verifyAppleIdentityToken = async (identityToken: string, rawNonce: string) => {
  const { payload } = await jwtVerify(identityToken, jwks, {
    issuer: APPLE_ISSUER,
    audience: CLIENT_ID,
  });
  const expectedNonce = crypto.createHash("sha256").update(rawNonce).digest("hex");
  if (payload.nonce !== expectedNonce) throw new Error("Apple nonce mismatch");
  return {
    sub: String(payload.sub),
    email: typeof payload.email === "string" ? payload.email : undefined,
    emailVerified: payload.email_verified === true || payload.email_verified === "true",
  };
};

const clientSecret = async () => {
  const key = await importPKCS8(process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n"), "ES256");
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID! })
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience(APPLE_ISSUER)
    .setSubject(CLIENT_ID)
    .sign(key);
};

const postForm = async (path: string, form: Record<string, string>) =>
  fetch(`${APPLE_ISSUER}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form),
  });

/** Returns Apple's refresh token, or null if the exchange failed. */
export const exchangeAppleCode = async (code: string): Promise<string | null> => {
  const res = await postForm("/auth/token", {
    client_id: CLIENT_ID,
    client_secret: await clientSecret(),
    code,
    grant_type: "authorization_code",
  });
  if (!res.ok) {
    console.error("Apple code exchange failed", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { refresh_token?: string };
  return data.refresh_token ?? null;
};

export const revokeAppleToken = async (refreshToken: string) => {
  const res = await postForm("/auth/revoke", {
    client_id: CLIENT_ID,
    client_secret: await clientSecret(),
    token: refreshToken,
    token_type_hint: "refresh_token",
  });
  if (!res.ok) console.error("Apple token revoke failed", res.status);
};
```

```ts
// src/controllers/authController.ts (sketch — reuse the helpers /auth/google uses)
export const appleLogin = async (req: Request, res: Response) => {
  const { identityToken, authorizationCode, nonce, intent = "login", name } = req.body ?? {};
  if (!identityToken || !nonce) {
    return res.status(400).json({ code: "INVALID_REQUEST", message: "Missing Apple token." });
  }

  let apple;
  try {
    apple = await verifyAppleIdentityToken(identityToken, nonce);
  } catch {
    return res.status(401).json({ code: "INVALID_APPLE_TOKEN", message: "Apple sign-in failed. Please try again." });
  }

  let user = await User.findOne({ appleId: apple.sub });
  if (!user && apple.email && apple.emailVerified) {
    user = await User.findOne({ email: apple.email.toLowerCase() });
    if (user) user.appleId = apple.sub;
  }
  if (!user) {
    if (intent !== "signup") {
      return res.status(404).json({ code: "ACCOUNT_NOT_FOUND", message: "No account found for this Apple ID." });
    }
    user = new User({
      name: name?.trim() || apple.email?.split("@")[0] || "Cricket Fan",
      email: apple.email?.toLowerCase(),
      emailVerified: true,
      appleId: apple.sub,
    });
  }
  if (name?.trim() && !user.name) user.name = name.trim();
  if (user.email) user.emailVerified = true;

  if (authorizationCode) {
    const refreshToken = await exchangeAppleCode(authorizationCode);
    if (refreshToken) user.appleRefreshToken = refreshToken;
  }
  await user.save();

  return res.json(await issueSession(user)); // same as /auth/google
};

// routes: router.post("/auth/apple", appleLogin);
```

Schema additions on `User`: `appleId` (string, unique, sparse/nullable), `appleRefreshToken`
(string, nullable). Add both to the hard-delete list.

## Apple Developer / App Store Connect setup (one time)

1. **Certificates, IDs & Profiles → Identifiers → `com.cricketscorecounter.mobile`** → enable
   **Sign in with Apple** (as a primary App ID). Save. This regenerates provisioning profiles;
   Xcode automatic signing / Xcode Cloud picks them up on the next build.
2. **Keys → +** → name it e.g. "CSC Sign in with Apple", tick **Sign in with Apple**, configure →
   primary App ID `com.cricketscorecounter.mobile`. Download the `.p8` (only downloadable once) and
   note the **Key ID**. Put them in the backend env (`APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`).
3. Optional: **Server-to-Server Notification Endpoint** on the App ID
   (e.g. `https://api.cricket-score-counter.com/api/v1/auth/apple/notifications`) to receive
   `consent-revoked` / `account-delete` events — when received, clear `appleId` /
   `appleRefreshToken` or delete the account. Not required for review.
4. Optional, only if you use relay emails for transactional mail (OTP / password reset via Brevo):
   **Services → Sign in with Apple for Email Communication** → register the Brevo sending domain
   and pass SPF, otherwise Apple's relay drops those emails.

## App-side files (for reference)

- `ios/App/App/App.entitlements` — `com.apple.developer.applesignin = [Default]`, wired via
  `CODE_SIGN_ENTITLEMENTS` in the App target (Debug + Release).
- `ios/App/Podfile` — `CapacitorCommunityAppleSignIn` pod (regenerated by `npx cap sync ios`).
- `src/utils/appleSignIn.ts` — nonce generation + native sheet; cancel is silent.
- `src/services/AuthService.ts` — `loginWithApple` → `POST /auth/apple`.
- `src/components/AuthPages.tsx` — black "Sign in with Apple" / "Sign up with Apple" button on
  iOS above Google; "No account found for this Apple ID" + Sign up prompt on 404.

## Test plan

- [ ] New Apple ID, Sign up screen → account created, lands on home, name saved.
- [ ] Same Apple ID on Login screen after logout → logs in (no name sent this time; name kept).
- [ ] New Apple ID on Login screen → "No account found… Sign up" prompt.
- [ ] "Hide My Email" → relay email stored; account works.
- [ ] Apple ID whose email matches an existing email/Google account → linked, same data.
- [ ] Cancel the Apple sheet → no error toast.
- [ ] Delete account for an Apple user → no password asked, account gone, and in iOS
      **Settings → Apple ID → Sign-In & Security → Sign in with Apple** the app is no longer listed.
- [ ] Google sign-in on iOS still works; deleting an email-only account on iOS doesn't crash.
- [ ] Tampered token / wrong nonce → 401.
