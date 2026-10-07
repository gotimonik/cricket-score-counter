import { Capacitor } from "@capacitor/core";

/**
 * True only inside the native iOS app. Use it to hide anything App Review
 * would reject that is fine on the website or Android: SMS
 * login, links or promos for other app stores, and unmoderated text from
 * other users.
 *
 * Safe to branch rendering on: index.tsx renders the iOS app from scratch
 * instead of hydrating the prerendered web HTML, so iOS-only markup can't
 * cause hydration mismatches.
 */
export const IS_IOS_APP = Capacitor.getPlatform() === "ios";
