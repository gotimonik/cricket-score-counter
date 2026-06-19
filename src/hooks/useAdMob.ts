import { useEffect, useRef } from "react";
import {
  AdMob,
  BannerAdPosition,
  BannerAdPluginEvents,
  BannerAdSize,
  type AdMobError,
} from "@capacitor-community/admob";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import {
  ADMOB_BANNER_AD_ID,
  ADMOB_INTERSTITIAL_AD_ID,
} from "../utils/constant";

export const useAdMob = () => {
  const initialized = useRef(false);
  const listenersRegistered = useRef(false);
  const bannerLoadedListener = useRef<PluginListenerHandle | null>(null);
  const bannerFailedListener = useRef<PluginListenerHandle | null>(null);

  const isNative = Capacitor.isNativePlatform();

  const initialize = async () => {
    if (!isNative || initialized.current) return;

    try {
      await AdMob.initialize();

      if (!listenersRegistered.current) {
        bannerLoadedListener.current = await AdMob.addListener(
          BannerAdPluginEvents.Loaded,
          () => {
            console.log("Banner loaded");
          },
        );

        bannerFailedListener.current = await AdMob.addListener(
          BannerAdPluginEvents.FailedToLoad,
          (error: AdMobError) => {
            console.log("Banner failed", JSON.stringify(error));
          },
        );

        listenersRegistered.current = true;
      }

      initialized.current = true;
    } catch (error) {
      console.error("AdMob initialization failed", error);
    }
  };

  useEffect(() => {
    return () => {
      if (!isNative || !listenersRegistered.current) return;

      void bannerLoadedListener.current?.remove();
      void bannerFailedListener.current?.remove();

      bannerLoadedListener.current = null;
      bannerFailedListener.current = null;

      listenersRegistered.current = false;
    };
  }, [isNative]);

  // show banner for 60 seconds by default, can be changed by passing durationMs parameter
  const showBanner = async (durationMs = 60000) => {
    if (!isNative) return;

    await initialize();

    try {
      if (ADMOB_BANNER_AD_ID) {
        await AdMob.removeBanner().catch(() => {});
        await AdMob.showBanner({
          adId: ADMOB_BANNER_AD_ID,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
        });
      }

      if (durationMs) {
        setTimeout(async () => {
          await hideBanner();
        }, durationMs);
      }
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
      if (ADMOB_INTERSTITIAL_AD_ID)
        await AdMob.prepareInterstitial({
          adId: ADMOB_INTERSTITIAL_AD_ID,
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
