import {createNavigationContainerRef} from '@react-navigation/native'

export const appNavigationRef = createNavigationContainerRef()

export function navigate(name: string, params: any) {
  if (appNavigationRef.isReady()) {
    appNavigationRef.navigate(name, params)
  }
}
