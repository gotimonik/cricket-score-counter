/**
 * Native "Sign in with Apple" for the iOS app (Capacitor plugin
 * @capacitor-community/apple-sign-in). Only call this when IS_IOS_APP.
 *
 * Replay protection: we generate a random raw nonce, give Apple its SHA-256
 * hex digest (Apple copies it into the identity token's `nonce` claim) and
 * send the raw value to the backend, which checks
 * sha256(rawNonce) === token.nonce. See docs/apple-sign-in-api.md.
 */

/** iOS bundle ID: the `aud` of identity tokens issued to the native app. */
export const APPLE_IOS_CLIENT_ID = "com.cricketscorecounter.mobile";

export type AppleSignInResult = {
  identityToken: string;
  authorizationCode: string;
  rawNonce: string;
  /** Only present the FIRST time the user authorizes this app. */
  givenName?: string;
  familyName?: string;
  email?: string;
};

/** Thrown when the user closes the Apple sheet; callers should stay quiet. */
export class AppleSignInCancelled extends Error {
  constructor() {
    super("Apple sign-in was cancelled.");
    this.name = "AppleSignInCancelled";
  }
}

const randomNonce = (bytes = 32) => {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => v.toString(16).padStart(2, "0")).join("");
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
};

// ASAuthorizationError.canceled is code 1001; the plugin only forwards
// error.localizedDescription, so match on that text.
const isCancelError = (err: unknown) => {
  const message = String(
    (err as { message?: unknown })?.message ?? err ?? "",
  ).toLowerCase();
  return message.includes("1001") || message.includes("cancel");
};

export const signInWithAppleNative = async (): Promise<AppleSignInResult> => {
  const { SignInWithApple } = await import(
    "@capacitor-community/apple-sign-in"
  );
  const rawNonce = randomNonce();
  const hashedNonce = await sha256Hex(rawNonce);

  let response;
  try {
    ({ response } = await SignInWithApple.authorize({
      clientId: APPLE_IOS_CLIENT_ID,
      // Required by the plugin's types; unused by the native iOS flow.
      redirectURI: "https://www.cricket-score-counter.com",
      scopes: "email name",
      nonce: hashedNonce,
    }));
  } catch (err) {
    if (isCancelError(err)) throw new AppleSignInCancelled();
    throw err;
  }

  if (!response?.identityToken) {
    throw new Error("Apple didn't return a sign-in token. Please try again.");
  }

  return {
    identityToken: response.identityToken,
    authorizationCode: response.authorizationCode,
    rawNonce,
    givenName: response.givenName || undefined,
    familyName: response.familyName || undefined,
    email: response.email || undefined,
  };
};
