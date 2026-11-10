import {useSelector} from 'react-redux'
import {RootStateType} from '@domain/states/store'

export const useSpbLocalList = () => useSelector((state: RootStateType) => state.spbLocal?.list)
export const useSpbLocalDetail = () => useSelector((state: RootStateType) => state.spbLocal?.detail)
export const useSpbLocalFormStatus = () => useSelector((state: RootStateType) => state.spbLocal?.formStatus)
export const useSpbLocalDeleteStatus = () => useSelector((state: RootStateType) => state.spbLocal?.deleteStatus)
