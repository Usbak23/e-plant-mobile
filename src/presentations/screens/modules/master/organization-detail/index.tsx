import { Button, Header, ModalInfo, Text } from '@components/index'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, StyleSheet, View } from 'react-native'
import { theme } from '@app/presentations/utils/styles'
import DetailInfo from './organization-detail-info'
import { ScrollView } from 'react-native-gesture-handler'
import DivisionCard from '@screens/modules/master/division-list/division-card'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import EmptyList from '@components/Empty'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@domain/states/store'
import ModalAsk from '@components/ModalAsk'
import { showSuccessToast, showErrorToast } from '@components/Toast'
import { useDivisionsByOrganizationAll } from '@app/domain/states/division/hooks'
import { Division } from '@app/models/eplant/Division'
import {
  useIsAllowedToOrganizationOrganization,
  useIsAllowedToOrganizeDivision,
  useIsAllowedToSeeDivision,
  useManagedDivisions,
  useManagedOrganizations,
} from '@app/domain/states/user/hooks'
import { IRSDivision } from '@app/domain/states/division/reducer'
import { IEffectPayload } from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
let debounceSearch: NodeJS.Timeout


const OrganizationDetail = () => {
  const managedOrganizations = useManagedOrganizations()
  const managedDivisions = useManagedDivisions()
  const isAllowedToOrganizeOrganization = useIsAllowedToOrganizationOrganization()
  const isAllowedToSeeDivision = useIsAllowedToSeeDivision()
  const isAllowedToOrganizeDivision = useIsAllowedToOrganizeDivision()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const itemParam = route.params?.item
  const [item, setItem] = useState(itemParam)
  const [modalAsk, setModalAskOpen] = useState(false)
  const [modalInfoDivision, setModalInfoDivision] = useState<{ isOpen: boolean; isDanger: boolean; message: string }>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    search: '',
    name: '',
    organization: item?.id
  })
  const [selectedDivision, setSelectedDivision] = useState<Division | undefined>(undefined)
  const { organizationDetail, deleteOrganizationStatus } = useSelector((state: RootStateType) => state.organization)
  const { deleteDivisionStatus } = useSelector((state: RootStateType) => state.division)

  const { divisionList }: IRSDivision = useSelector((state: RootStateType) => state?.division || {})
  const { data: lists, loading }: IEffectPayload = divisionList || { loading: false }
  const { docs, hasNextPage, nextPage, page } = lists || { docs: [], page: 1 }

  const onPopupDelete = () => {
    setModalAskOpen(true)
  }
  const handleDelete = () => {
    dispatch(actions.deleteOrganization.request({ loading: true, data: item?.id }))
    setModalAskOpen(false)
  }

  const handleDivisonDelete = () => {
    dispatch(actions.deleteDivision.request({ loading: true, data: selectedDivision?.id }))
    setModalAskOpen(false)
  }
  const onDivisionPopupDelete = (item?: Division) => setSelectedDivision(item)

  const onDivisionPopupEdit = (itemDivision?: Division) => {
    navigation.navigate(Routes.DIVISION_FORM, {
      item: itemDivision,
      module: item,
    })
  }

  const getAllDivision = () => {
    dispatch(actions.getAllDivision.request({ loading: true, data: { organization: item.id } }))
  }

  const handleSearch = (search: string) => {
    setQuery({ ...query, name: search })
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({ ...query, name: search, page: 1, limit })
    }, 400)
  }

  const isAllowed = (): boolean => {
    if (isAllowedToOrganizeOrganization) {
      return true
    }
    return isAllowedToOrganizeDivision && managedOrganizations.find(o => o.id == item?.id) != undefined
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getCurrentUser.request({ loading: true }))
      dispatch(actions.getOrganizationDetail.request({ loading: true, data: item.id }))
      getAllDivision()
    }
  }, [isFocused])

  useEffect(() => {
    if (!!organizationDetail?.data?.name && organizationDetail?.data?.id === item.id) {
      setItem(organizationDetail?.data)
    }
  }, [organizationDetail?.data])

  useEffect(() => {
    const data = deleteOrganizationStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteOrganizationStatus?.data])

  useEffect(() => {
    const error = deleteOrganizationStatus?.error
    if (error) {
      // showErrorToast(error?.message)
    }
  }, [deleteOrganizationStatus?.error])

  useEffect(() => {
    setSelectedDivision(undefined)
    const error = deleteDivisionStatus?.error
    if (error) {
      setModalInfoDivision({
        ...modalInfoDivision,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
      // showErrorToast(error.message)
    }
  }, [deleteDivisionStatus?.error])

  useEffect(() => {
    setSelectedDivision(undefined)
    const data = deleteDivisionStatus?.data?.data
    if (data?.code == '200') {
      // showSuccessToast('Divisi berhasil dihapus')
      setModalInfoDivision({
        ...modalInfoDivision,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      getAllDivision()
    }
  }, [deleteDivisionStatus?.data])

  const getData = useCallback(data => {
    dispatch(
      actions.getDivisionLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    getData({ ...query, page: 1, limit, organization: item?.id })
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({ ...query, page: nextPage, limit })
  }

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  const HeaderView = () => <Header title="Detail Organisasi" />

  const BlockHeaderView = () => (
    <View style={styles.blockHeaderView}>
      {isAllowedToSeeDivision ? (
        <Text type="bold" size={12}>
          Divisi Terkait { }
        </Text>
      ) : (
        <View />
      )}

      {/* {isAllowedToOrganizeDivision && managedOrganizations.find(o => o.id == item?.id) != undefined  */}
      {isAllowed() ? (
        <Button style={styles.addBlockButton} onPress={() => navigation.navigate(Routes.DIVISION_FORM, { module: item })}>
          <Text size={10} color={theme.colors.white}>
            Tambah divisi
          </Text>
        </Button>
      ) : (
        <View />
      )}
    </View>
  )


  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger={true}
      isOpen={modalAsk}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus organisasi?'}
      description={'Menghapus organisasi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalBlockDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDivisonDelete()}
      isDanger={true}
      isOpen={selectedDivision != undefined}
      onTouchOutside={() => setSelectedDivision(undefined)}
      title={'Anda yakin ingin menghapus divisi?'}
      description={'Menghapus divisi akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const renderItem = ({ item, index }: any) => {
    return (
      <DivisionCard
        isAllowedToOrganizeDivision={
          isAllowedToOrganizeDivision && managedDivisions.find(div => div.id == item.id) != undefined
        }
        onPopupEdit={onDivisionPopupEdit}
        onPopupDelete={onDivisionPopupDelete}
        onTap={() => navigation.navigate(Routes.DIVISION_DETAIL, { division: item })}
        key={index}
        division={item}
      />
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <FlatList
        ListHeaderComponent={<View style={{ flex: 1 }}>
          <DetailInfo
            item={item}
            onPopupDelete={onPopupDelete}
            isAllowedToOrganizeOrganization={
              isAllowedToOrganizeOrganization
            }
          />
          <BlockHeaderView />
        </View>}
        onScrollBeginDrag={Keyboard.dismiss}
        data={docs?.length > 0 && isAllowedToSeeDivision ? docs : []}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
        onEndReached={getNextPage}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={{ paddingBottom: 50, }}

      />

      <ModalDelete />
      <ModalBlockDelete />
      <ModalInfo
        title={modalInfoDivision.isDanger ? 'Anda tidak dapat menghapus divisi ini' : 'Divisi berhasil dihapus'}
        description={modalInfoDivision.isDanger ? modalInfoDivision.message : undefined}
        isDanger={modalInfoDivision.isDanger}
        isOpen={modalInfoDivision.isOpen}
        onTouchOutside={() => setModalInfoDivision({ ...modalInfoDivision, isOpen: false })}
        onPositiveButtonTap={() => setModalInfoDivision({ ...modalInfoDivision, isOpen: false })}
      />
    </SafeAreaView>
  )
}

export default OrganizationDetail

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  blockHeaderView: {
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addBlockButton: {
    backgroundColor: theme.colors.black,
  },
  addBlockButtonText: {
    color: theme.colors.white,
  },
})
