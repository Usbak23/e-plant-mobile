// import notifee from '@notifee/react-native'
// import * as c from '@utils/notifications/constantsNotificationt'

export const onDisplayNotificationExportFile = async function (title: string, body: string, id: string, payload?: any) {
  // Notifee temporarily disabled
  console.log('Notification:', title, body)
  // // Request permissions (required for iOS)
  // await notifee.requestPermission()

  // // Create a channel (required for Android)
  // const channelId = await notifee.createChannel({
  //   id: c.EXPORT_NOTIFICATION_CHANNEL,
  //   name: c.EXPORT_NOTIFICATION_CHANNEL_NAME,
  // })

  // // Display a notification
  // await notifee.displayNotification({
  //   title: title,
  //   body: body,
  //   data: {
  //     ...payload,
  //   },
  //   android: {
  //     channelId,
  //     smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //     // pressAction is needed if you want the notification to open the app when pressed
  //     pressAction: {
  //       id: id,
  //     },
  //   },
  // })
}
