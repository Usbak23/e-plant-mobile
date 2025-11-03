import {createNavigationContainerRef} from '@react-navigation/native'

export const authNavigationRef = createNavigationContainerRef()

export function navigate(name: string, params: any) {
  if (authNavigationRef.isReady()) {
    authNavigationRef.navigate(name, params)
  }
}
