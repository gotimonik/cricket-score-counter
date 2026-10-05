#!/bin/sh
# Xcode Cloud runs this right after cloning the repo.
#
# The iOS project depends on files that are NOT in git:
#   - ios/App/Pods/...            (CocoaPods; "Pods-App.release.xcconfig" error)
#   - ios/App/App/public/...      (the built web app)
#   - ios/App/App/capacitor.config.json / config.xml
# so we build the web app and run `npx cap sync ios`, which copies the web
# build into the iOS project and runs `pod install`.
set -e

export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1

echo "==> Installing Node.js 20 and CocoaPods"
brew install node@20 cocoapods
export PATH="$(brew --prefix node@20)/bin:$PATH"
node -v
npm -v
pod --version

cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "==> Installing npm packages"
npm ci --legacy-peer-deps --no-audit --no-fund

echo "==> Writing .env.production from Xcode Cloud environment variables"
# Build settings are NOT stored in git. Add each REACT_APP_* value as an
# environment variable in the Xcode Cloud workflow (Environment > Environment
# Variables) and it is written here for the build.
env | grep '^REACT_APP_' | sort > .env.production || true
if ! grep -q '^REACT_APP_API_URL=' .env.production; then
  echo "error: REACT_APP_API_URL is not set. Add the REACT_APP_* variables in the Xcode Cloud workflow's Environment settings." >&2
  exit 1
fi
echo "Wrote $(wc -l < .env.production | tr -d ' ') REACT_APP_* settings"

echo "==> Building the web app"
# react-scripts directly (not `npm run build`): the postbuild prerender step
# needs a desktop Chrome, which is only useful for the website, not the app.
# Build settings come from the .env.production written above.
CI=false GENERATE_SOURCEMAP=false npx react-scripts build

echo "==> Syncing web build into iOS + pod install"
npx cap sync ios

echo "==> Done"
