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
  androidAppId: "id.eplant.app.android.production",
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
    apiKey: "",
    authDomain: "",
    projectId: "eplant-production",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
  apiDomain: "https://sahabatagrogroup.com",
  crmDomain: "https://sahabatagrogroup.com",
  eplantDomain: "https://sahabatagrogroup.com"
}

export default Config
 