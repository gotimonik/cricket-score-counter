import React, { useEffect } from "react";

/**
 * AdSenseBanner renders a Google AdSense ad unit.
 * Only use on content-rich pages to comply with AdSense policy.
 */

interface AdSenseBannerProps {
  show: boolean;
}

/**
 * AdSenseBanner renders a Google AdSense ad unit.
 * Only use on content-rich pages to comply with AdSense policy.
 *
 * @param show - Must be true to render the ad. Enforces policy compliance.
 */
const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ show }) => {
  // Site-wide compliance guard: Only render if show is true AND page has substantial content
  const isContentRich = typeof document !== "undefined" && document.body && document.body.innerText && document.body.innerText.length > 200;

  useEffect(() => {
    if (show && isContentRich) {
      // @ts-ignore
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    }
  }, [show, isContentRich]);

  if (!show || !isContentRich) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "AdSenseBanner not rendered: show prop is false, missing, or page is not content-rich."
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
