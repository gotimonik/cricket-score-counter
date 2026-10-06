const AUTH_TOKEN_KEY = "cricket-auth-token";
const AUTH_REFRESH_TOKEN_KEY = "cricket-auth-refresh-token";
const AUTH_USER_KEY = "cricket-auth-user";
const AUTH_SESSION_EVENT = "auth-session-changed";

/** The word the user must type to confirm permanent account deletion. */
export const DELETE_ACCOUNT_CONFIRMATION = "DELETE";

const getApiBaseUrl = () => {
  const explicitBase = (process.env.REACT_APP_API_URL || "").trim();
  if (explicitBase) return explicitBase.replace(/\/+$/, "");

  const websocketBase = (process.env.REACT_APP_WEBSOCKET_API_URL || "").trim();
  if (websocketBase) {
    return websocketBase
      .replace(/^wss:\/\//i, "https://")
      .replace(/^ws:\/\//i, "http://")
      .replace(/\/+$/, "");
  }

  return "";
};

const API_ROOT_URL = getApiBaseUrl();
const API_BASE_URLS = [`${API_ROOT_URL}/api/v1`];
let authConfigPromise: Promise<{ mobileOtpLogin?: boolean }> | null = null;
const REQUEST_TIMEOUT_MS = 20000;

type AuthResponse = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
  message?: string;
  /** Signup: an email code must be entered before the account can be used. */
  verificationRequired?: boolean;
  email?: string;
  /** Seconds until another email code can be requested. */
  resendAfterSeconds?: number;
};

/** An error response from the API, keeping its status and machine code. */
export class ApiError extends Error {
  status: number;
  code?: string;
  data: Record<string, unknown>;

  constructor(message: string, status: number, data: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = typeof data.code === "string" ? data.code : undefined;
    this.data = data;
  }
}

/** Thrown by login when the account's email still needs its code. */
export const EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED";

/** Thrown by loginWithGoogle (intent "login") for an unregistered account. */
export const ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";

const parseResponse = async <T>(response: Response): Promise<T> =>
  (await response.json().catch(() => ({}))) as T;

const postAuth = async <T extends Record<string, unknown>>(
  path: string,
  payload: T,
): Promise<AuthResponse> => {
  let lastData: (AuthResponse & { error?: string }) | null = null;
  let lastStatus = 0;

  for (const baseUrl of API_BASE_URLS) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<AuthResponse & { error?: string }>(
      response,
    );

    if (response.ok) {
      return data;
    }

    lastData = data;
    lastStatus = response.status;
    if (response.status !== 404 && response.status !== 405) {
      break;
    }
  }

  throw new ApiError(
    lastData?.message ||
      lastData?.error ||
      (lastStatus ? "Something went wrong." : "Unable to reach auth server."),
    lastStatus,
    (lastData ?? {}) as Record<string, unknown>,
  );
};

const postAuthFirst = async <T extends Record<string, unknown>>(
  paths: string[],
  payload: T,
): Promise<AuthResponse> => {
  let lastData: (AuthResponse & { error?: string }) | null = null;
  let lastStatus = 0;

  for (const path of paths) {
    for (const baseUrl of API_BASE_URLS) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await parseResponse<AuthResponse & { error?: string }>(
        response,
      );

      if (response.ok) {
        return data;
      }

      lastData = data;
      lastStatus = response.status;
      // A 404 *with* an error code is a real answer (e.g. ACCOUNT_NOT_FOUND),
      // not a missing route, so don't fall through to the next path.
      const hasErrorCode =
        typeof (data as { code?: unknown }).code === "string";
      if ((response.status !== 404 && response.status !== 405) || hasErrorCode) {
        throw new ApiError(
          data.message || data.error || "Authentication failed.",
          response.status,
          data as unknown as Record<string, unknown>,
        );
      }
    }
  }

  throw new ApiError(
    lastData?.message ||
      lastData?.error ||
      (lastStatus ? "Authentication method is not available yet." : "Unable to reach auth server."),
    lastStatus,
    (lastData ?? {}) as Record<string, unknown>,
  );
};

const getStoredItem = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const setStoredItem = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
};

const removeStoredItem = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

const emitAuthSessionChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
};

const saveSession = (data: AuthResponse) => {
  const token = data.token || data.accessToken;
  if (token) {
    setStoredItem(AUTH_TOKEN_KEY, token);
  }
  if (data.refreshToken) {
    setStoredItem(AUTH_REFRESH_TOKEN_KEY, data.refreshToken);
  }
  if (data.user) {
    setStoredItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }
  emitAuthSessionChanged();
};

const clearSession = () => {
  removeStoredItem(AUTH_TOKEN_KEY);
  removeStoredItem(AUTH_REFRESH_TOKEN_KEY);
  removeStoredItem(AUTH_USER_KEY);
  emitAuthSessionChanged();
};

const refreshSession = async (): Promise<AuthResponse | null> => {
  const refreshToken = getStoredItem(AUTH_REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  for (const baseUrl of API_BASE_URLS) {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await parseResponse<AuthResponse & { error?: string }>(
      response,
    );

    if (response.ok) {
      saveSession(data);
      return data;
    }

    if (response.status !== 404 && response.status !== 405) {
      break;
    }
  }

  clearSession();
  return null;
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  hasRetriedRefresh = false,
): Promise<T> => {
  const token = getStoredItem(AUTH_TOKEN_KEY);
  let lastData: { message?: string; error?: string } | null = null;
  let lastStatus = 0;

  for (const baseUrl of API_BASE_URLS) {
    // Never let a stalled request leave a screen on its loading spinner
    // forever (seen on iOS when the network drops mid-request): give up
    // after REQUEST_TIMEOUT_MS so the page can show an error instead.
    const controller =
      !options.signal && typeof AbortController !== "undefined"
        ? new AbortController()
        : null;
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      : null;
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        ...(controller ? { signal: controller.signal } : {}),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers ?? {}),
        },
      });
    } catch (error) {
      if (controller?.signal.aborted) {
        throw new Error(
          "The server is taking too long to respond. Please check your connection and try again.",
        );
      }
      throw error;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
    const data = await parseResponse<T & { message?: string; error?: string }>(
      response,
    );

    if (response.ok) {
      // The backend silently rotates the access token on almost every
      // authenticated response (a sliding session). This just needs to be
      // persisted for the next request - it is NOT a login/logout and must
      // NOT dispatch the auth-session-changed event: components such as
      // TournamentManager refetch their data (itself an authenticated
      // request) whenever that event fires, and that refetch would receive
      // another rotated token, re-firing the event and re-triggering the
      // refetch forever. Dispatching here previously caused an infinite
      // loop of /tournaments and /player-teams requests.
      const refreshedAccessToken = response.headers.get("X-Access-Token");
      if (refreshedAccessToken) {
        setStoredItem(AUTH_TOKEN_KEY, refreshedAccessToken);
      }
      return data;
    }

    if (response.status === 401 && !hasRetriedRefresh) {
      const refreshedSession = await refreshSession();
      if (refreshedSession?.token || refreshedSession?.accessToken) {
        return request<T>(path, options, true);
      }
    }

    lastData = data;
    lastStatus = response.status;
    if (response.status !== 404 && response.status !== 405) {
      break;
    }
  }

  throw new Error(
    lastData?.message ||
      lastData?.error ||
      (lastStatus ? "Something went wrong." : "Unable to reach server."),
  );
};

export const AuthService = {
  login: async (email: string, password: string) => {
    const data = await postAuth("/auth/login", { email, password });
    saveSession(data);
    return data;
  },

  /**
   * Creates the account. Usually returns `verificationRequired: true` and no
   * session: call verifyEmail with the emailed code to finish.
   */
  signup: async (name: string, email: string, password: string) => {
    const data = await postAuth("/auth/signup", { name, email, password });
    if (!data.verificationRequired) {
      saveSession(data);
    }
    return data;
  },

  /** Finishes signup (or an unverified login) with the emailed code. */
  verifyEmail: async (email: string, otp: string) => {
    const data = await postAuth("/auth/email/verify", { email, otp });
    saveSession(data);
    return data;
  },

  resendVerificationEmail: (email: string) =>
    postAuth("/auth/email/resend", { email }),

  /** Step 1 of a password reset: emails a code. */
  forgotPassword: (email: string) =>
    postAuth("/auth/forgot-password", { email }),

  /**
   * intent "login" never creates an account: the backend answers 404 with
   * code ACCOUNT_NOT_FOUND (thrown as an ApiError) if the Google account
   * isn't registered. "signup" creates it if needed.
   */
  loginWithGoogle: async (
    idToken: string,
    intent: "login" | "signup" = "login",
  ) => {
    const data = await postAuthFirst(
      ["/auth/google"],
      { idToken, credential: idToken, intent },
    );
    saveSession(data);
    return data;
  },

  /**
   * What the login screens can offer, e.g. `mobileOtpLogin` is false until
   * the backend can actually send SMS. Cached; resolves to {} on failure.
   */
  getAuthConfig: (): Promise<{ mobileOtpLogin?: boolean }> => {
    if (!authConfigPromise) {
      authConfigPromise = fetch(`${API_BASE_URLS[0]}/auth/config`)
        .then((response) => (response.ok ? response.json() : {}))
        .catch(() => ({}))
        .then((data: { mobileOtpLogin?: boolean }) => {
          // Retry on the next call if it failed.
          if (!data || typeof data.mobileOtpLogin !== "boolean") {
            authConfigPromise = null;
          }
          return data || {};
        });
    }
    return authConfigPromise;
  },

  /** intent "login" never sends a code to an unregistered number (404
   *  ACCOUNT_NOT_FOUND). 429 OTP_COOLDOWN / OTP_LIMIT carry resendAfterSeconds. */
  requestMobileOtp: async (
    phoneNumber: string,
    intent: "login" | "signup" = "login",
  ) =>
    postAuthFirst(
      ["/auth/mobile/request-otp"],
      { phoneNumber, mobileNumber: phoneNumber, phone: phoneNumber, intent },
    ),

  verifyMobileOtp: async (
    phoneNumber: string,
    otp: string,
    intent: "login" | "signup" = "login",
    name?: string,
  ) => {
    const data = await postAuthFirst(
      ["/auth/mobile/verify-otp"],
      {
        phoneNumber,
        mobileNumber: phoneNumber,
        phone: phoneNumber,
        otp,
        code: otp,
        intent,
        ...(name ? { name } : {}),
      },
    );
    saveSession(data);
    return data;
  },

  /** Step 2 of a password reset: code + new password. Logs the user in. */
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const data = await postAuth("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    saveSession(data);
    return data;
  },

  setPassword: async (newPassword: string, currentPassword?: string) => {
    const data = await request<AuthResponse>("/auth/set-password", {
      method: "POST",
      body: JSON.stringify({
        password: newPassword,
        ...(currentPassword ? { currentPassword } : {}),
      }),
    });
    if (data.user) {
      setStoredItem(AUTH_USER_KEY, JSON.stringify(data.user));
      emitAuthSessionChanged();
    }
    return data;
  },

  refreshCurrentUser: async () => {
    const data = await request<{ user?: unknown }>("/auth/me", {
      method: "GET",
    });
    if (data.user) {
      setStoredItem(AUTH_USER_KEY, JSON.stringify(data.user));
      emitAuthSessionChanged();
    }
    return data.user ?? null;
  },

  logout: async () => {
    const token = getStoredItem(AUTH_TOKEN_KEY);

    try {
      if (token) {
        const responses = await Promise.all(
          API_BASE_URLS.map((baseUrl) =>
            fetch(`${baseUrl}/auth/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          ),
        );
        const response =
          responses.find((candidate) => candidate.ok) || responses[0];

        if (
          !response.ok &&
          response.status !== 404 &&
          response.status !== 405
        ) {
          const data = (await response.json().catch(() => ({}))) as {
            message?: string;
            error?: string;
          };
          throw new Error(data.message || data.error || "Unable to logout.");
        }
      }
    } finally {
      clearSession();
    }
  },

  /**
   * Permanently (hard) deletes the signed-in user's account and every record
   * owned by it on the server - see docs/delete-account-api.md. Password
   * accounts must re-enter their password; the backend verifies it.
   *
   * On success the local session is cleared. The caller is responsible for
   * wiping on-device match data (clearLocalUserData) and native sign-out.
   */
  deleteAccount: async (options: { password?: string } = {}) => {
    const data = await request<{ deleted?: boolean; message?: string }>(
      "/auth/account",
      {
        method: "DELETE",
        body: JSON.stringify({
          confirmation: DELETE_ACCOUNT_CONFIRMATION,
          ...(options.password ? { password: options.password } : {}),
        }),
      },
    );
    clearSession();
    return data;
  },

  getToken: () => getStoredItem(AUTH_TOKEN_KEY),
  getRefreshToken: () => getStoredItem(AUTH_REFRESH_TOKEN_KEY),

  request,

  getUser: () => {
    const user = getStoredItem(AUTH_USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      removeStoredItem(AUTH_USER_KEY);
      return null;
    }
  },

  isLoggedIn: () => Boolean(getStoredItem(AUTH_TOKEN_KEY)),

  subscribe: (listener: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(AUTH_SESSION_EVENT, listener);
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, listener);
      window.removeEventListener("storage", listener);
    };
  },
};

export default AuthService;
