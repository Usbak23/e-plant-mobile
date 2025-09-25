E-Plantation

### How to build a release app
Since, react-native having so much issues including the big problem in november 2022 that caused all RN project in the world messed up, here is how we build a release version of it.

1. Run this script  
```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

It will generates assets on android folder.

2. Deletes the duplicated folder
Duplicated files/folder are marked with different color in VSCode and other IDEs.
Please take a look and deletes it EXCEPTS the index.android.bundle. Mostly, we deletes the drawable-xxxxx

3. gradlew clean
enter the android directory from the terminal and run this  
```
.\gradlew clean
```

mac/linux:  
```
./gradlew clean
```

4. build the app
Inside the android folder, run the script
```
gradlew app:assembleRelease
```