const AUTH_TOKEN_KEY = "cricket-auth-token";
const AUTH_USER_KEY = "cricket-auth-user";
const AUTH_SESSION_EVENT = "auth-session-changed";

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

type AuthResponse = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  message?: string;
};

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

  throw new Error(
    lastData?.message ||
      lastData?.error ||
      (lastStatus ? "Something went wrong." : "Unable to reach auth server."),
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
      if (response.status !== 404 && response.status !== 405) {
        throw new Error(data.message || data.error || "Authentication failed.");
      }
    }
  }

  throw new Error(
    lastData?.message ||
      lastData?.error ||
      (lastStatus ? "Authentication method is not available yet." : "Unable to reach auth server."),
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
  if (data.user) {
    setStoredItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }
  emitAuthSessionChanged();
};

const clearSession = () => {
  removeStoredItem(AUTH_TOKEN_KEY);
  removeStoredItem(AUTH_USER_KEY);
  emitAuthSessionChanged();
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getStoredItem(AUTH_TOKEN_KEY);
  let lastData: { message?: string; error?: string } | null = null;
  let lastStatus = 0;

  for (const baseUrl of API_BASE_URLS) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    const data = await parseResponse<T & { message?: string; error?: string }>(
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

  signup: async (name: string, email: string, password: string) => {
    const data = await postAuth("/auth/signup", { name, email, password });
    saveSession(data);
    return data;
  },

  loginWithGoogle: async (idToken: string) => {
    const data = await postAuthFirst(
      ["/auth/google", "/auth/login/google"],
      { idToken, credential: idToken },
    );
    saveSession(data);
    return data;
  },

  requestMobileOtp: async (phoneNumber: string) =>
    postAuthFirst(
      ["/auth/mobile/request-otp", "/auth/phone/request-otp", "/auth/otp/send"],
      { phoneNumber, mobileNumber: phoneNumber, phone: phoneNumber },
    ),

  verifyMobileOtp: async (phoneNumber: string, otp: string) => {
    const data = await postAuthFirst(
      ["/auth/mobile/verify-otp", "/auth/phone/verify-otp", "/auth/otp/verify"],
      { phoneNumber, mobileNumber: phoneNumber, phone: phoneNumber, otp, code: otp },
    );
    saveSession(data);
    return data;
  },

  resetPassword: (email: string, newPassword: string) =>
    postAuth("/auth/reset-password", { email, newPassword }),

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

  getToken: () => getStoredItem(AUTH_TOKEN_KEY),

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
