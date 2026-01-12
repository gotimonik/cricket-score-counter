import React, { useEffect } from "react";

/**
 * AdSenseBanner renders a Google AdSense ad unit.
 * Only use on content-rich pages to comply with AdSense policy.
 */
const AdSenseBanner: React.FC = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      // @ts-ignore
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "16px 0" }}
      data-ad-client="ca-pub-6031242056409187"
      data-ad-slot="1234567890"  // Replace with your actual ad slot
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSenseBanner;
