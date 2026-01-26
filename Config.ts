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
  iosBundleId: "id.eplant.app.ios.production",
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
    apiKey: "",
    authDomain: "",
    projectId: "e-plantation-f2fa5",
    storageBucket: "e-plantation-f2fa5.firebasestorage.app",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
  apiDomain: "https://sahabatagrogroup.com",
  crmDomain: "https://sahabatagrogroup.com",
  eplantDomain: "http://192.168.50.151:7000"
}

export default Config
 