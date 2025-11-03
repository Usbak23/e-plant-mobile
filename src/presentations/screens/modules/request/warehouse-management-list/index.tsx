import {actions, RootStateType} from '@app/domain/states/store'
import {theme} from '@app/presentations/utils/styles'
import {Header, ModalAsk, SelectInput, SortPopup, Text} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, RefreshControl, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import * as yup from 'yup'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {WarehouseManagementSortOptions} from './sort-options'
import WarehouseManagementListDetailInfo from './warehouse-list-detail-info'
import {useWatch} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import WarehouseManagementCard from './warehouse-management-card'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {IEffectPayload} from '@app/domain/states/types'
import {IRSWarehouseManagement} from '@app/domain/states/warehouse-management/reducer'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {IManagementWarehouse, IManagementWarehouseApproveForm} from '@app/models/eplant/WarehouseManagement'
import { useIsAllowedToOrganizeWarehouseManagement } from '@app/domain/states/user/hooks'

let debounceSearch: NodeJS.Timeout
const limit = 10

const types = [
  {label: 'Menunggu dikeluarkan', value: 'Menunggu Persetujuan'},
  {label: 'Dikeluarkan', value: 'Dikeluarkan'},
]

const validationSchema = yup.object().shape({
  status: yup.string().required('Tipe permintaan wajib dipilih'),
})

const WareHousemanagementList = () => {
  const isAllowedToOrganize = useIsAllowedToOrganizeWarehouseManagement()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const routes: any = useRoute()
  const organization = routes.params?.organization
  const division = routes.params?.division
  const month = routes.params?.month
  const year = routes.params?.year

  const [query, setQuery] = useState({
    sort: '',
    search: '',
    status: '',
    year: year,
    month: month.value || '',
    divisionId: division?.value || '',
  })

  const resolver = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      status: '',
    },
  })

  const {formWarehouseManagementApproveStatus, warehouseList}: IRSWarehouseManagement = useSelector(
    (state: RootStateType) => state?.warehouseReducer || {},
  )
  const {data: lists, loading}: IEffectPayload = warehouseList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const [selectedItem, setSelectedItem] = useState<IManagementWarehouse | undefined>()

  const typeWatcher = useWatch({
    control: control,
    name: 'status',
    defaultValue: control._defaultValues.status || '',
  })

  const getData = useCallback(data => {
    dispatch(actions.getWarehouseList.request({loading: true, data}))
  }, [])

  const refreshData = useCallback(() => {
    if (typeWatcher != '') {
      getData({...query, page: 1, limit})
    }
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }

    getData({...query, page: nextPage, limit})
  }

  const handleSearch = (name: string) => {
    setQuery({...query, search: name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: name, page: 1, limit})
    }, 400)
  }

  const handleSort = (v: string) => {
    const newState = {...query, sort: v}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

  useEffect(() => {
    if (typeWatcher != '') {
      setQuery({...query, status: typeWatcher})
      getData({...query, status: typeWatcher, limit, page: 1})
    }
  }, [typeWatcher, isFocused])

  useEffect(() => {
    const error = formWarehouseManagementApproveStatus?.error
    if (error) {
      const msg = error?.message || 'Gagal mengeluarkan barang'
      showErrorToast(msg)
    }
  }, [formWarehouseManagementApproveStatus?.error])

  useEffect(() => {
    const data = formWarehouseManagementApproveStatus?.data
    if (data?.data?.status == 'success') {
      showSuccessToast('Berhasil dikeluarkan')
      refreshData()
    }
  }, [formWarehouseManagementApproveStatus?.data])

  const handleIssued = () => {
    if (selectedItem?.id) {
      const obj: IManagementWarehouseApproveForm = {
        managementWarehouseId: selectedItem?.id as string,
        status: 'Dikeluarkan',
        notes: '',
      }
      dispatch(actions.approveWarehouse.request({loading: true, data: obj}))
    }
    setSelectedItem(undefined)
  }

  const onIssued = (item: IManagementWarehouse) => {
    setSelectedItem(item)
  }
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <SortPopup onSelect={handleSort} options={WarehouseManagementSortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <AntDesign name="filter" size={14} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )

  const renderItem = ({item, index}: any) => {
    return (
      <WarehouseManagementCard
        isAllowedToOrganize={isAllowedToOrganize}
        key={index}
        item={item}
        onIssued={() => onIssued(item)}
        onAddUntilan={() => {
          navigation.navigate(Routes.WAREHOUSE_MANAGEMENT_BPU, {
            item,
            parent: {organization, division, month, year: year},
          })
        }}
        onTap={() => {
          navigation.navigate(Routes.WAREHOUSE_MANAGEMENT_DETAIL, {
            parent: {organization, division, month, year: year},
            item,
          })
        }}
      />
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Manajemen Gudang" />
      <View style={[styles.container]}>
        <View style={styles.wrapSearch}>
          <TextInput
            placeholderTextColor={theme.colors.darkGray}
            value={query.search}
            onChangeText={handleSearch}
            placeholder="Masukkan kata kunci"
            style={[styles.searhInput]}
          />
          <View style={styles.icon}>
            <AntDesign name="search1" size={14} color={theme.colors.textThinBlack} />
          </View>
        </View>

        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <MenuButton />
        </TouchableOpacity>

      </View>

      <View style={{flex: 1, padding: 16}}>
        <FlatList
          ListHeaderComponent={
            <>
              <WarehouseManagementListDetailInfo data={{organization, division, month, year: year}} />
              <SelectInput
                hideLabel={true}
                isRequired
                errorText={errors?.status?.message}
                control={control}
                name={'status'}
                placeholder="Pilih status permintaan"
                items={types}
              />
            </>
          }
          data={typeWatcher == '' ? [] : docs}
          renderItem={renderItem}
          ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
          refreshControl={
            page === 1 ? (
              <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
            ) : undefined
          }
          onEndReachedThreshold={0.5}
          onEndReached={getNextPage}
          ListEmptyComponent={EmptyList}
        />
      </View>

      <ModalAsk
        onPositiveButtonTap={handleIssued}
        isDanger={true}
        isOpen={selectedItem != undefined}
        onTouchOutside={() => {
          setSelectedItem(undefined)
        }}
        title={'Anda yakin ingin mengeluarkan barang?'}
        description={'Mengubah barang akan mengubah stok barang pada material dan tidak dapat dikembalikan'}
        positiveButtonText={'Keluarkan'}
      />
    </SafeAreaView>
  )
}

export default WareHousemanagementList

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  filter: {
    marginVertical: 8,
  },
  container: {
    padding: 8,
    marginHorizontal: 10,

    flexDirection: 'row',
  },
  searhInput: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    color: theme.colors.textThinBlack,
    height: 40,
    width: '100%',
    flex: 1,
    paddingLeft: 35,
  },
  icon: {
    position: 'absolute',
    left: 11,
    top: 14,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#F1F3F6',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapSearch: {flex: 1, flexDirection: 'row'},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    marginHorizontal: 8,
  },
  modalView: {
    paddingHorizontal: 16,
    marginHorizontal: 18,
    paddingBottom: 10,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
