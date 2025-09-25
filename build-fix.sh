#!/bin/bash

echo "=== E-Plantation Build Fix ==="

# Use Node 14
source ~/.nvm/nvm.sh
nvm use 14

# Set legacy OpenSSL for older Node versions
export NODE_OPTIONS="--openssl-legacy-provider"

# Clear caches
echo "Clearing caches..."
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf android/app/build

# Create assets directory
mkdir -p android/app/src/main/assets

# Generate bundle manually
echo "Generating bundle..."
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Clean and build AAB
echo "Building AAB..."
cd android
./gradlew clean
unset NODE_OPTIONS  # Remove for gradle
./gradlew app:bundleRelease

echo "=== Build Complete ==="
echo "AAB location: android/app/build/outputs/bundle/release/app-release.aab"