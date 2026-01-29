import * as configJson from './__config__/config.json'

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
  appName: configJson.appName,
  displayName: configJson.displayName,
  androidAppId: configJson.androidAppId,
  iosBundleId: configJson.iosBundleId,
  googleSignInConfig: configJson.googleSignInConfig,
  firebaseConfig: configJson.firebaseConfig,
  apiDomain: configJson.apiDomain,
  crmDomain: configJson.crmDomain,
  eplantDomain: configJson.eplantDomain
}

export default Config
 