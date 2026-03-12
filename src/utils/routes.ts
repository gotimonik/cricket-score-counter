import { isStoredV1 } from "./constant";

export const normalizePath = (path: string): string => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const toVersionedPath = (path: string, _useV1: boolean): string => {
  const normalized = normalizePath(path);
  const basePath =
    normalized === "/v1"
      ? "/"
      : normalized.startsWith("/v1/")
      ? normalized.slice(3)
      : normalized;
  return basePath;
};

export const toCurrentVersionPath = (
  currentPathname: string,
  path: string
): string => {
  void currentPathname;
  return toVersionedPath(path, false);
};

export const isV1Path = (_pathname: string): boolean => isStoredV1();
