import {getToken} from '@app/domain/services/utils/Axios'
import {Platform, PermissionsAndroid} from 'react-native'
import RNFS from 'react-native-fs'

const downloadFile = (url: string, filename: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ])
      }
      const dirx = RNFS.DownloadDirectoryPath
      const token = await getToken()
      if (typeof token === 'string') {
        // const date = new Date()
        const toFile = `${dirx}/` + filename
        const r = await RNFS.downloadFile({
          fromUrl: url,
          headers: {
            Authorization: token,
          },
          toFile,
        }).promise
        if (r.statusCode == 200) {
          return resolve(toFile)
        }
        return reject({message: 'Error with status code ' + r.statusCode})
      }
    } catch (error: any) {
      reject(error)
    }
  })
}
export default downloadFile
