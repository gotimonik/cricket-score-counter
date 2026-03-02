# Production Release Checklist

This checklist covers shipping the Capacitor app to both Apple App Store and Google Play Store.

## 1. Release Metadata

- [ ] Choose release version and build numbers:
  - Android: `APP_VERSION_NAME` + `APP_VERSION_CODE` in `android/gradle.properties`
  - iOS: `APP_VERSION_NAME` + `APP_BUILD_NUMBER` in `ios/App/App.xcodeproj/project.pbxproj`
- [ ] Confirm final `APP_BUNDLE_ID` / `APP_ANDROID_APPLICATION_ID`
- [ ] Confirm environment variables (for example `REACT_APP_WEBSOCKET_API_URL`)

## 2. Content and Compliance

- [ ] Verify Privacy Policy URL is live and accurate
- [ ] Verify ads/analytics/tracking disclosures for iOS and Android
- [ ] Confirm permissions requested by app match actual usage
- [ ] Validate Terms/Disclaimer pages

## 3. Visual Assets

- [ ] App icons (iOS and Android) are final and store-compliant
- [ ] Splash/launch assets are final
- [ ] Store screenshots are updated for latest UI

## 4. Native Signing Setup

### Android (Play Store)

- [ ] Create `android/keystore.properties` from `android/keystore.properties.example`
- [ ] Ensure upload keystore file exists at `storeFile` path
- [ ] Verify release signing config resolves in `android/app/build.gradle`

### iOS (App Store)

- [ ] Set `APP_DEVELOPMENT_TEAM` in `ios/App/App.xcodeproj/project.pbxproj`
- [ ] Open Xcode and verify Signing & Capabilities for Release config
- [ ] Confirm provisioning profiles/certificates are valid

## 5. Build and Sync

- [ ] Install dependencies: `npm install --legacy-peer-deps`
- [ ] Build + copy web assets: `npm run build:mobile`
- [ ] Sync Android native project: `npm run cap:sync:android`
- [ ] Sync iOS native project: `npm run cap:sync:ios`

## 6. QA / Regression Validation

- [ ] Smoke test major flows on Android device/emulator:
  - Create game
  - Join game
  - Live scoring actions
  - Match history / share links
  - Preferences (theme/font/compact/reduced motion)
- [ ] Smoke test major flows on iOS simulator/device
- [ ] Confirm layout/safe-area behavior on notched phones
- [ ] Confirm websocket reconnection/resume behavior after app backgrounding

## 7. Store Submission

### Google Play

- [ ] Generate signed release AAB from Android Studio
- [ ] Upload to internal testing track
- [ ] Verify Pre-launch report
- [ ] Roll out to production

### Apple App Store

- [ ] Archive and upload from Xcode to App Store Connect
- [ ] Validate build in TestFlight
- [ ] Submit for review with updated metadata/privacy
- [ ] Release after approval

## 8. Post-Release

- [ ] Verify crash-free sessions and analytics after rollout
- [ ] Monitor websocket/API error rates
- [ ] Keep rollback plan ready (previous approved build)
