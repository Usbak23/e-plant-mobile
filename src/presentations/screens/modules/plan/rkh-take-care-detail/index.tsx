import {Header, ModalAsk, Text} from '@components/index'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import DetailInfo from './rkh-take-care-detail-info'
import {ScrollView} from 'react-native-gesture-handler'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import {IRKHTakeCareRow} from '@models/eplant/RKHTakeCare'
import SummaryCardRKHTakeCare from './summary-card'
import RKHTakeCareMaterialCard from './rkh-take-care-material-card'
import {useRKHTakeCareAll} from '@app/domain/states/rkh-take-care/hooks'
import {useIsAllowedToOrganizeRKH} from '@app/domain/states/user/hooks'
// import {useIsAllowedToDeleteRKH, useIsAllowedToEditRKH} from '@app/domain/states/user/hooks'

const RKHTakeCareDetail = () => {
  const {rkhTakeCareDetail, deleteRKHTakeCareStatus} = useSelector((state: RootStateType) => state.rkhTakeCare)
  const isAllowedToOrganizeRKH = useIsAllowedToOrganizeRKH()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const rkh = route.params?.rkh
  const itemParam = route.params?.item
  const isDraft = Boolean(itemParam?.id)
  const isTemp = Boolean(itemParam?.isTemp)
  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const [tabIdx, setTabIdx] = useState(0)
  const dateRkhSimplified = rkh?.dateRkh ? rkh.dateRkh.substring(0, 10) : undefined
  const rkhTakeCareAll = useRKHTakeCareAll(dateRkhSimplified)

  const [item, setItem] = useState(itemParam)

  useEffect(() => {
    if (route.params?.onShouldGoBack) {
      navigation.goBack()
    }
  }, [route.params?.onShouldGoBack])

  const onPopupDelete = (item?: IRKHTakeCareRow) => {
    if (item) {
      setModalAskOpen(true)
    }
  }

  const handleDelete = () => {
    dispatch(actions.deleteRKHTakeCare.request({loading: true, data: item}))
    setModalAskOpen(false)
    if (!item?.id) {
      showSuccessToast('Data draft berhasil dihapus')
      navigation.goBack()
    }
  }

  // 353
  const constructDefaultMaterials = () => {
    if (isDraft && item?.rkhActivities?.material?.materials && Array.isArray(item.rkhActivities.material.materials)) {
      const mapped = item.rkhActivities.material.materials.map((i: any) => {
        return {
          _id: i.rawMaterial?.id,
          cost: i.cost,
          qty: i.qty,
          name: i.rawMaterial?.name || i.name || '?',
          roleCategory: [],
        }
      })
      return mapped
    } else if (!isDraft && isTemp && item?.material && Array.isArray(item.material)) {
      const mapped = item.material.map((i: any) => {
        return {
          _id: i.rawMaterial?.id || i.id || '',
          cost: i.cost,
          qty: i.qty,
          name: i.rawMaterial?.name || i.name || '',
          roleCategory: [],
        }
      })
      return mapped
    }
    return []
  }

  const calculateTotalHkMaterial = () => {
    if (
      !isTemp &&
      itemParam?.rkhActivities?.material?.materials &&
      Array.isArray(itemParam?.rkhActivities?.material?.materials)
    ) {
      let q = 0
      itemParam.rkhActivities.material.materials.forEach((material: any) => {
        q += material.qty
      })
      return q
    } else if (isTemp && itemParam?.material && Array.isArray(itemParam.material)) {
      let q = 0
      itemParam.material.forEach((material: any) => {
        q += material.qty
      })
      return q
    }
    return 0
  }

  useEffect(() => {
    const error = deleteRKHTakeCareStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteRKHTakeCareStatus?.error])

  useEffect(() => {
    const data = deleteRKHTakeCareStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteRKHTakeCareStatus?.data])

  const HeaderView = () => <Header title="Detail RKH" />

  const OfflineText = () => (
    <View style={{flex: 1, padding: 8, backgroundColor: '#F3D6DC', borderRadius: 8, marginHorizontal: 16}}>
      <Text size={11} color="red">
        Anda sedang melihat data offline.
      </Text>
    </View>
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus RKH ini?'}
      description={'Menghapus RKH akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const MaterialTab = () => (
    <View style={{flex: 1}}>
      <SummaryCardRKHTakeCare totalMaterialPlan={calculateTotalHkMaterial()} totalMaterialRealization={0} />
      {constructDefaultMaterials().map((i: any, index: number) => (
        <RKHTakeCareMaterialCard key={index} item={i} />
      ))}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView>
        {isTemp && !isDraft && <OfflineText />}
        <DetailInfo
          item={item}
          rkh={rkh}
          onPopupDelete={onPopupDelete}
          isAllowedToOrganizeRKH={isAllowedToOrganizeRKH}
        />
        <View style={{marginHorizontal: 18}}>
          <MaterialTab />
        </View>
      </ScrollView>
      <ModalDelete />
    </SafeAreaView>
  )
}

export default RKHTakeCareDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  tabButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 15,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  wrapTab: {flexDirection: 'row'},
})
