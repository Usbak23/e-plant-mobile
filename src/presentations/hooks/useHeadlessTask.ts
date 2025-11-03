import {useEffect} from 'react'
// import BackgroundFetch from 'react-native-background-fetch'
import {syncData} from './useSyncData'

const useHeadlessTask = () => {
  const onTaskExecuted = async (taskId: string) => {
    syncData()
    // BackgroundFetch.finish(taskId)
  }

  const onTaskTimeOut = async (taskId: string) => {
    // BackgroundFetch.finish(taskId)
  }
  const initScheduledTask = async () => {
    // await BackgroundFetch.configure(
    //   {
    //     minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
    //     // Android options
    //     forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
    //     stopOnTerminate: false,
    //     enableHeadless: true,
    //     startOnBoot: true,
    //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    //     requiresCharging: false, // Default
    //     requiresDeviceIdle: false, // Default
    //     requiresBatteryNotLow: false, // Default
    //     requiresStorageNotLow: false, // Default
    //   },
    //   onTaskExecuted,
    //   onTaskTimeOut,
    // )
    // await BackgroundFetch.start()
  }

  useEffect(() => {
    // initScheduledTask()
  }, [])

  return null
}

export default useHeadlessTask
