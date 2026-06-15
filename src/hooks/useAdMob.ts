import { useRef } from "react";
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

const BANNER_AD_ID = "ca-app-pub-6031242056409187/1927931970"; // Banner ID
const INTERSTITIAL_AD_ID = "ca-app-pub-6031242056409187/2646383203"; // Interstitial ID

export const useAdMob = () => {
  const initialized = useRef(false);

  const isNative = Capacitor.isNativePlatform();

  const initialize = async () => {
    if (!isNative || initialized.current) return;

    try {
      await AdMob.initialize();
      initialized.current = true;
    } catch (error) {
      console.error("AdMob initialization failed", error);
    }
  };

  const showBanner = async () => {
    if (!isNative) return;

    await initialize();

    try {
      await AdMob.showBanner({
        adId: BANNER_AD_ID,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
      });
    } catch (error) {
      console.error("Banner error", error);
    }
  };

  const hideBanner = async () => {
    if (!isNative) return;

    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error("Hide banner error", error);
    }
  };

  const removeBanner = async () => {
    if (!isNative) return;

    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error("Remove banner error", error);
    }
  };

  const showInterstitial = async () => {
    if (!isNative) return;

    await initialize();

    try {
      await AdMob.prepareInterstitial({
        adId: INTERSTITIAL_AD_ID,
      });

      await AdMob.showInterstitial();
    } catch (error) {
      console.error("Interstitial error", error);
    }
  };

  return {
    initialize,
    showBanner,
    hideBanner,
    removeBanner,
    showInterstitial,
  };
};