import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'

export const useMonitoringTphList = () => useSelector((state: RootStateType) => state.monitoringTph?.list)
export const useMonitoringTphSummary = () => useSelector((state: RootStateType) => state.monitoringTph?.summary)
