import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cricketscorecounter.mobile",
  appName: "Cricket Score Counter",
  webDir: "build",

  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      backgroundColor: "#5D8CBA",
      androidScaleType: "FULLSCREEN",
    },
  },
};

export default config;