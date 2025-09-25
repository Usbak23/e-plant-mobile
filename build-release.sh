#!/bin/bash

echo "Building E-Plantation Release..."

# Step 1: Generate bundle
echo "Step 1: Generating bundle..."
export NODE_OPTIONS="--openssl-legacy-provider"
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Step 2: Clean duplicated files (manual step reminder)
echo "Step 2: Please delete duplicated drawable-xxxxx folders (keep index.android.bundle)"
read -p "Press Enter after cleaning duplicated files..."

# Step 3: Clean gradle
echo "Step 3: Cleaning gradle..."
cd android
./gradlew clean

# Step 4: Build release AAB for Play Store
echo "Step 4: Building release AAB for Play Store..."
./gradlew app:bundleRelease

echo "Build completed!"
echo "AAB location: android/app/build/outputs/bundle/release/app-release.aab"
echo "Ready for Play Store upload!"