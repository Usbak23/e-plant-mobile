import React, {useEffect} from 'react'
import {Linking} from 'react-native'
import Routes from '@app/presentations/navigation/Routes'
import branch from 'react-native-branch'
import {navigate as authNavigate} from '@app/presentations/navigation/services/auth'
import {navigate as appNavigate} from '@app/presentations/navigation/services/app'
import {useNavigation} from '@react-navigation/native'
import qs from 'query-string'

const useMount = func => useEffect(() => func(), [])

//Navigate when app got opened through pure deep link -> arvis.app.link
export const useNavigateDeeplink = async (path?: string) => {
  const routing = () => {
    branch.subscribe(({error, params, uri}) => {
      if (params?.module == 'reset-password') {
        return authNavigate(Routes.RESET_PASSWORD, {
          token: params?.token,
          email: params?.email,
        })
      } else if (params?.module == 'see-material') {
        return appNavigate(Routes.REPORT_RKB_MATERIAL, {
          year: params?.year,
          month: params?.month,
          blockId: params?.blockId,
          subActivityId: params?.subActivityId,
        })
      } else if (params?.module == 'see-material-bpk') {
        return appNavigate(Routes.SEE_BPK_MATERIAL, {
          subActivityId: params?.subActivityId,
          year: params?.year,
          month: params?.month,
        })
      }
    })
  }

  useMount(() => {
    branch.subscribe(({error, params, uri}) => {
      if (params?.module == 'reset-password') {
        return authNavigate(Routes.RESET_PASSWORD, {
          token: params?.token,
          email: params?.email,
        })
      } else if (params?.module == 'see-material') {
        return appNavigate(Routes.REPORT_RKB_MATERIAL, {
          year: params?.year,
          month: params?.month,
          blockId: params?.blockId,
          subActivityId: params?.subActivityId,
        })
      } else if (params?.module == 'see-material-bpk') {
        return appNavigate(Routes.SEE_BPK_MATERIAL, {
          organizationId: params?.organizationId,
          divisionId: params?.divisionId,
          subActivityId: params?.subActivityId,
          year: params?.year,
          month: params?.month,
        })
      }
    })
  })
}
