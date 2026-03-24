import React, { useEffect } from "react";

/**
 * AdSenseBanner renders a Google AdSense ad unit.
 * Only use on content-rich pages to comply with AdSense policy.
 */


interface AdSenseBannerProps {
  show: boolean;
  /**
   * Minimum content length required to render the ad. Default: 200.
   * Set higher for stricter AdSense compliance.
   */
  minContentLength?: number;
}

/**
 * AdSenseBanner renders a Google AdSense ad unit.
 * Only use on content-rich pages to comply with AdSense policy.
 *
 * @param show - Must be true to render the ad. Enforces policy compliance.
 */

const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ show, minContentLength = 500 }) => {
  const adsEnabled = process.env.REACT_APP_ENABLE_ADS === "true";
  // Site-wide compliance guard: Only render if show is true AND page has substantial content
  const isContentRich = typeof document !== "undefined" && document.body && document.body.innerText && document.body.innerText.length > minContentLength;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isBlockedUtilityRoute =
    pathname === "/join-game" ||
    pathname === "/privacy-policy" ||
    pathname === "/disclaimer";


  useEffect(() => {
    if (adsEnabled && show && isContentRich && !isBlockedUtilityRoute) {
      // @ts-ignore
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    }
  }, [adsEnabled, show, isContentRich, isBlockedUtilityRoute]);

  if (!adsEnabled || !show || !isContentRich || isBlockedUtilityRoute) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `AdSenseBanner not rendered: ads disabled or page not content-rich (minContentLength=${minContentLength}).`
      );
    }
    return null;
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "16px 0" }}
      data-ad-client="ca-pub-6031242056409187"
      data-ad-slot="3168855636"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSenseBanner;
