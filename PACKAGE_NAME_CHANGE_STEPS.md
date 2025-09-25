# Langkah-langkah Setelah Mengubah Package Name

Package name telah diubah dari `id.eplant.app.android.production` ke `id.eplant.app.android.prod.v2`

## File yang telah diupdate:
1. ✅ `android/app/build.gradle` - applicationId
2. ✅ `android/app/src/main/AndroidManifest.xml` - package name
3. ✅ `__config__/config.json` - androidAppId
4. ✅ `android/app/src/main/java/com/eplant/MainActivity.java` - package declaration
5. ✅ `android/app/src/main/java/com/eplant/MainApplication.java` - package declaration

## Langkah-langkah yang perlu dilakukan manual:

### 1. Firebase Configuration
- Buka Firebase Console (https://console.firebase.google.com)
- Pilih project "e-plantation"
- Tambahkan aplikasi Android baru dengan package name: `id.eplant.app.android.prod.v2`
- Download file `google-services.json` yang baru
- Replace file `android/app/google-services.json` dengan yang baru

### 2. Google Play Console
- Buka Google Play Console
- Buat aplikasi baru dengan package name: `id.eplant.app.android.prod.v2`
- Upload APK/AAB yang baru

### 3. Branch.io Configuration (jika diperlukan)
- Update konfigurasi Branch.io untuk package name yang baru
- Update `branchIO.package` di config.json jika diperlukan

### 4. Google Maps API (jika diperlukan)
- Pastikan API key Google Maps mendukung package name yang baru
- Update restrictions di Google Cloud Console jika diperlukan

### 5. Build dan Test
```bash
# Clean project
cd android
./gradlew clean
cd ..

# Generate bundle
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build APK
cd android
./gradlew assembleRelease
```

### 6. Verifikasi
- Test aplikasi di device
- Pastikan semua fitur berfungsi (Firebase, Maps, Branch.io, dll)
- Test deep linking
- Test push notifications

## Catatan Penting:
- Package name yang baru: `id.eplant.app.android.prod.v2`
- Ini adalah aplikasi baru di Google Play Store, bukan update dari aplikasi lama
- Users perlu install aplikasi baru, tidak bisa update dari aplikasi lama