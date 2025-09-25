import {PermissionsAndroid, Platform} from 'react-native'
import RNFS from 'react-native-fs'

export const writeFile = (string: string, filename: string, encoding: string = 'utf8') =>
  new Promise(async (resolve, reject) => {
    let date = new Date()
    let num = Math.floor(date.getTime() + date.getSeconds() / 2)
    let RootDir = RNFS.DownloadDirectoryPath
    let title = filename
    let path = RootDir + '/' + num + title
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ])
    }
    const isExist = await RNFS.exists(RootDir)
    if (!isExist) {
      await RNFS.mkdir(RootDir)
    }
    RNFS.writeFile(path, string, encoding)
      .then(res => {
        return resolve(path)
      })
      .catch(reject)
  })
