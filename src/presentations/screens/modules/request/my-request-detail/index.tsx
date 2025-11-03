import {IRSRequests} from '@app/domain/states/request/reducer'
import {actions, RootStateType} from '@app/domain/states/store'
import { useIsAllowedToOrganizeMyRequest } from '@app/domain/states/user/hooks'
import {IMyRequest, IMyRequestDetail} from '@app/models/eplant/MyRequest'
import {IRequestHistory} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {Header, ModalGeneral, Text} from '@app/presentations/_shared-components'
import {useIsFocused, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import MyRequestDetailHeader from './my-request-detail-header'
import MyRequestHistoryCard from './my-request-history-card'

const MyRequestDetail = () => {
  const isAllowedToOrganizeMyRequest = useIsAllowedToOrganizeMyRequest()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const routes: any = useRoute()
  const item = routes?.params?.item
  const parent = routes?.params?.parent
  const [req, setReq] = useState<undefined | IMyRequestDetail>()
  const histories = req?.requestHistories || []

  const {myRequesstDetail}: IRSRequests = useSelector((state: RootStateType) => state?.requestReducer)

  useEffect(() => {
    const detail = myRequesstDetail?.data
    if (detail) {
      setReq(detail)
    }
  }, [myRequesstDetail?.data])

  useEffect(() => {
    dispatch(actions.getMyRequestDetail.request({loading: true, data: item?.id}))
  }, [isFocused])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Permintaan" />
      <ScrollView>
        <MyRequestDetailHeader isAllowedToOrganize={isAllowedToOrganizeMyRequest} item={item} itemDetail={req} parent={parent} />
        <Text style={{margin: 16}} type="semibold" size={14}>
          Riwayat Permintaan
        </Text>
        {histories.map((requestHistory: any, index: number) => (
          <MyRequestHistoryCard key={index} requestHistory={requestHistory} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
})

export default MyRequestDetail
