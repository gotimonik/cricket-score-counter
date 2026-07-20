import { useCallback, useEffect, useRef } from "react";
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

  const initialize = useCallback(async () => {
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
  }, [isNative]);

  useEffect(() => {
    return () => {
      clearHideTimer();

      if (!isNative || !listenersRegistered.current) return;

      void bannerLoadedListener.current?.remove();
      void bannerFailedListener.current?.remove();

      bannerLoadedListener.current = null;
      bannerFailedListener.current = null;

      listenersRegistered.current = false;
    };
  }, [isNative]);

  const bannerVisible = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerOperation = useRef(Promise.resolve());

  const runBannerOperation = async (operation: () => Promise<void>) => {
    bannerOperation.current = bannerOperation.current
      .then(operation)
      .catch((err) => console.error("Banner operation error", err));

    return bannerOperation.current;
  };

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const hideBanner = useCallback(async () => {
    if (!isNative) return;

    clearHideTimer();

    await runBannerOperation(async () => {
      if (!bannerVisible.current) return;

      try {
        await AdMob.hideBanner();
        bannerVisible.current = false;
      } catch (error) {
        console.error("Hide banner error", error);
      }
    });
  }, [isNative]);

  const removeBanner = useCallback(async () => {
    if (!isNative) return;

    clearHideTimer();

    await runBannerOperation(async () => {
      if (!bannerVisible.current) return;

      try {
        await AdMob.removeBanner();
      } catch (error) {
        console.error("Remove banner error", error);
      } finally {
        bannerVisible.current = false;
      }
    });
  }, [isNative]);

  const showBanner = useCallback(
    async (durationMs = 60000) => {
      if (!isNative) return;

      clearHideTimer();

      await runBannerOperation(async () => {
        try {
          await initialize();

          // Already showing
          if (bannerVisible.current) {
            return;
          }

          if (!ADMOB_BANNER_AD_ID) {
            return;
          }

          await AdMob.showBanner({
            adId: ADMOB_BANNER_AD_ID,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
          });

          bannerVisible.current = true;

          if (durationMs > 0) {
            hideTimer.current = setTimeout(() => {
              void hideBanner();
            }, durationMs);
          }
        } catch (error) {
          console.error("Banner error", error);
        }
      });
    },
    [initialize, hideBanner, isNative],
  );

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
