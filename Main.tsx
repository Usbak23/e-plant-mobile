// import React, {useEffect} from 'react'
// import 'react-native-gesture-handler'
import App from '@app/presentations/App'
import {Provider as ReduxProvider} from 'react-redux'
import flux from '@app/domain/states/store'
import {StatusBar} from 'react-native'
import {PersistGate} from 'redux-persist/integration/react'
import Toast from 'react-native-toast-message'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {ReduxNetworkProvider} from 'react-native-offline'
import {MenuProvider} from 'react-native-popup-menu'
import Config from './Config'
// import notifee, {EventType} from '@notifee/react-native'
// import FileViewer from 'react-native-file-viewer'
// import * as c from '@utils/notifications/constantsNotificationt'

export default function Main() {
  // useEffect(() => {
  //   return notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         console.log('User dismissed notification', detail.notification)
  //         break
  //       case EventType.PRESS:
  //         if (detail?.notification?.android?.channelId == c.EXPORT_NOTIFICATION_CHANNEL) {
  //           const path = detail?.notification?.data?.path
  //           if (path) {
  //             FileViewer.open(decodeURI(path))
  //               .then(v => {})
  //               .catch((e: any) => {
  //                 console.log('Unable to open file from notif:', e)
  //               })
  //           }
  //         }

  //         break
  //     }
  //   })
  // }, [])

  return (
    <MenuProvider>
      <ReduxProvider store={flux.store}>
        <ReduxNetworkProvider
          shouldPing={false}
          pingInBackground={false}
          pingOnlyIfOffline={false}
        >
          <PersistGate persistor={flux.persistor}>
            <SafeAreaProvider>
              <StatusBar backgroundColor={'white'} barStyle="dark-content" />
              <App />
              <Toast />
            </SafeAreaProvider>
          </PersistGate>
        </ReduxNetworkProvider>
      </ReduxProvider>
    </MenuProvider>
  )
}
