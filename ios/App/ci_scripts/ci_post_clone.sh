#!/bin/bash
# Xcode Cloud runs this right after cloning the repo.
#
# The iOS project depends on files that are NOT in git:
#   - ios/App/Pods/...            (CocoaPods; "Pods-App.release.xcconfig" error)
#   - ios/App/App/public/...      (the built web app)
#   - ios/App/App/capacitor.config.json / config.xml
# so we build the web app and run `npx cap sync ios`, which copies the web
# build into the iOS project and runs `pod install`.
#
# If this fails, open the build's Logs > "Run ci_post_clone.sh script": the
# last "==>" line shows which step stopped.
set -eo pipefail

export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
export HOMEBREW_NO_ENV_HINTS=1

fail() {
  echo "" >&2
  echo "error: $*" >&2
  exit 1
}

cd "${CI_PRIMARY_REPOSITORY_PATH:?CI_PRIMARY_REPOSITORY_PATH is not set}"

# --- 1. Build settings (checked first: fails in seconds, with a clear reason)
echo "==> [1/5] Writing .env.production from Xcode Cloud environment variables"
# Values are NOT stored in git. Add each REACT_APP_* value in App Store
# Connect > Xcode Cloud > Manage Workflows > (workflow) > Environment >
# Environment Variables.
env | grep '^REACT_APP_' | sort > .env.production || true
count=$(wc -l < .env.production | tr -d ' ')
echo "Found ${count} REACT_APP_* variable(s): $(cut -d= -f1 .env.production | tr '\n' ' ')"
for required in REACT_APP_API_URL REACT_APP_WEBSOCKET_API_URL; do
  grep -q "^${required}=" .env.production || fail "${required} is not set. Add the REACT_APP_* variables in the Xcode Cloud workflow (Environment > Environment Variables), then rebuild."
done

# --- 2. Tools
echo "==> [2/5] Node.js"
node_major() { node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'; }
if ! command -v node >/dev/null 2>&1 || [ "$(node_major)" -lt 18 ]; then
  brew install node@20 || fail "could not install Node.js with Homebrew"
  export PATH="$(brew --prefix node@20)/bin:$PATH"
fi
echo "node $(node -v), npm $(npm -v)"

echo "==> [3/5] CocoaPods"
if ! command -v pod >/dev/null 2>&1; then
  brew install cocoapods || fail "could not install CocoaPods with Homebrew"
fi
echo "pod $(pod --version)"

# --- 3. Web app
echo "==> [4/5] npm install + web build"
npm ci --legacy-peer-deps --no-audit --no-fund || fail "npm ci failed (is package-lock.json committed and in sync with package.json?)"
# react-scripts directly (not `npm run build`): the postbuild prerender step
# needs a desktop Chrome, which is only useful for the website, not the app.
CI=false GENERATE_SOURCEMAP=false npx react-scripts build || fail "web build (react-scripts build) failed"

# --- 4. Into the iOS project
echo "==> [5/5] npx cap sync ios (copies web build + pod install)"
npx cap sync ios || fail "npx cap sync ios / pod install failed"

echo "==> Done"
