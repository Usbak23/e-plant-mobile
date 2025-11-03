import {
  ICaturwulan,
  ICaturwulanCensus,
  ICensusDetail,
  IQuarterYearCensus,
  QuarterYearCensus,
} from '@app/models/eplant/Census'
import { Header, Loader, ModalAsk, Text } from '@app/presentations/_shared-components'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@domain/states/store'
import CensusDetailInfo from './census-detail-info'
import { IRSCensus } from '@app/domain/states/census/reducer'
import CensusMonthCard from './census-month-card'
import Routes from '@app/presentations/navigation/Routes'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useIsAllowedToOrganizeCensus } from '@app/domain/states/user/hooks'

const CensusDetail = () => {
  const isAllowedToOrganizeCensus = useIsAllowedToOrganizeCensus()
  const routes: any = useRoute()
  const navigation = useNavigation()
  const item = routes.params?.item
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const PARENT: any = routes?.params?.parent

  const { censusDetail, deleteCensusStatus }: IRSCensus = useSelector(
    (state: RootStateType) => state?.census || undefined,
  )
  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)

  const onPopupEdit = () => {
    //@ts-ignore
    navigation.navigate(Routes.CENSUS_FORM, { item, parent: { ...PARENT } })
  }

  const onPopupDelete = () => setModalAskOpen(true)

  const handleDelete = async () => {
    setModalAskOpen(false)
    dispatch(actions.deleteCensus.request({ loading: true, data: item.id }))
  }

  const constructCensusMonths = () => {
    if (
      censusDetail?.data?.censusMonths &&
      censusDetail?.data?.quarter &&
      Array.isArray(censusDetail?.data?.censusMonths)
    ) {
      const q = censusDetail.data.quarter
      const months = ICaturwulanCensus.filter((data: ICaturwulan) => data.caturwulan.toString() == q.toString()).map(
        (data: ICaturwulan, index: number) => {
          const oldValue = censusDetail?.data?.censusMonths[index] || undefined
          return {
            labelMonth: data.labelMonth,
            percentage: oldValue ? oldValue.percentage.toString() : '-',
            month: data.month,
            scatter: oldValue ? oldValue.scatter : '-',
            janjangPerMonth: oldValue ? oldValue?.janjangPerMonth : '-',
            yield: oldValue ? oldValue?.yield : '-',
            bjr: oldValue ? oldValue?.bjr : '-'
          }
        },
      )
      return months
    }
    return []
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getCensusDetail.request({ loading: true, data: item?.id }))
    }
  }, [isFocused])

  useEffect(() => {
    const error = deleteCensusStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteCensusStatus?.error])

  useEffect(() => {
    const data = deleteCensusStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteCensusStatus?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus sensus ini?'}
      description={'Menghapus sensus akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Detail Sensus" />
      <Loader loading={Boolean(censusDetail?.loading)} />
      <ScrollView style={styles.scroll}>
        <CensusDetailInfo
          isAllowedToOrganizeCensus={isAllowedToOrganizeCensus}
          censusDetail={censusDetail?.data?.id ? censusDetail.data : item}
          onPopupDelete={onPopupDelete}
          onPopupEdit={onPopupEdit}
        />
        <Text type="semibold" style={{ marginHorizontal: 20, marginVertical: 16 }}>
          Sensus Perbulan
        </Text>
        {constructCensusMonths().map((data, index) => (
          <CensusMonthCard key={index} censusMonth={data} />
        ))}
      </ScrollView>
      <ModalDelete />
    </SafeAreaView>
  )
}

export default CensusDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    paddingBottom: 16,
  },
})
