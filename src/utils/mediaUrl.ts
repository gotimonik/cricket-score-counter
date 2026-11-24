import { API_ROOT_URL } from "../services/AuthService";

/**
 * Images uploaded to our own backend (tournament logos, player photos) come
 * back as API paths like "/api/v1/tournaments/:id/logo?v=…". Make those
 * absolute so they load from the API host; leave external links alone.
 */
export function resolveApiMediaUrl(url: string): string;
export function resolveApiMediaUrl(url: string | undefined): string | undefined;
export function resolveApiMediaUrl(url: string | undefined): string | undefined {
  return url && url.startsWith("/api/") ? `${API_ROOT_URL}${url}` : url;
}
