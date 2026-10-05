import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cricketscorecounter.mobile",
  appName: "Cricket Score Counter",
  webDir: "build",

  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      // Web OAuth client ID (same as REACT_APP_GOOGLE_CLIENT_ID). On iOS the
      // native SDK signs in with the iOS client ID and requests the ID token
      // for this server client, which is what our backend verifies.
      serverClientId:
        "798809014639-5gp86q2pmvqc3dd16ah6r92dm1vqim9u.apps.googleusercontent.com",
      forceCodeForRefreshToken: false,
    },
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      backgroundColor: "#5D8CBA",
      androidScaleType: "FULLSCREEN",
    },
  },
};

export default config;