export const APP_VERSION_KEY = "app-version";
export const APP_VERSION_OLD = "old";
export const APP_VERSION_V1 = "v1";
export type AppVersion = typeof APP_VERSION_OLD | typeof APP_VERSION_V1;

export const isV1Path = (pathname: string): boolean =>
  pathname === "/v1" || pathname.startsWith("/v1/");

export const normalizePath = (path: string): string => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const toVersionedPath = (path: string, useV1: boolean): string => {
  const normalized = normalizePath(path);
  const basePath =
    normalized === "/v1"
      ? "/"
      : normalized.startsWith("/v1/")
      ? normalized.slice(3)
      : normalized;
  if (!useV1) return basePath;
  if (basePath === "/") return "/v1/";
  return `/v1${basePath}`;
};

export const toCurrentVersionPath = (
  currentPathname: string,
  path: string
): string => toVersionedPath(path, isV1Path(currentPathname));

export const getStoredAppVersion = (): AppVersion => {
  try {
    const version = localStorage.getItem(APP_VERSION_KEY);
    return version === APP_VERSION_V1 ? APP_VERSION_V1 : APP_VERSION_OLD;
  } catch {
    return APP_VERSION_OLD;
  }
};

export const setStoredAppVersion = (version: AppVersion): void => {
  try {
    localStorage.setItem(APP_VERSION_KEY, version);
  } catch {
    // ignore localStorage failures
  }
};
