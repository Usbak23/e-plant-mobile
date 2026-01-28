// import * as configJson from './__config__/config.json'

export interface IGoogleConfig {
  scopes: string[]
  webClientId: string
  iosClientId: string
  offlineAccess: boolean
}

export interface IFirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export interface IConfig {
  appName: string
  displayName: string
  androidAppId: string
  iosBundleId: string
  googleSignInConfig: IGoogleConfig
  firebaseConfig: IFirebaseConfig
  apiDomain: string
  crmDomain: string
  eplantDomain: string
}

const Config: IConfig = {
  appName: "eplant",
  displayName: "E-Plantation",
  androidAppId: "com.eplantation.mobile.app",
  iosBundleId: "id.eplant.app.android.production",
  googleSignInConfig: {
    scopes: [
      "profile",
      "email"
    ],
    webClientId: "",
    iosClientId: "",
    offlineAccess: false
  },
  firebaseConfig: {
    apiKey: "AIzaSyC8mq3rJNr2VdZ_KfrUILNNwOIN1MttB10",
    authDomain: "e-plantation-sag-prod.firebaseapp.com",
    projectId: "e-plantation-sag-prod",
    storageBucket: "e-plantation-sag-prod.firebasestorage.app",
    messagingSenderId: "643199958313",
    appId: "1:643199958313:android:6d607d0bb73b7fa78e4b38",
    measurementId: "G-LD2H8VZNSF"
  },
  apiDomain: "https://sahabatagrogroup.com",
  crmDomain: "https://sahabatagrogroup.com",
  eplantDomain: "https://sahabatagrogroup.com"
}

export default Config
 