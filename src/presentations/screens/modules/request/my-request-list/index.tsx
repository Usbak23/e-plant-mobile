import {ENUM_REQUEST_TYPE, IMyRequest, REQUEST_STATUS, REQUEST_TYPE} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {Header, ListFilterAlt, ModalAsk, SelectInput, SortPopup} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MyRequestDetailInfo from './my-request-detail-info'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import MyRequestCard from './my-request-card'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import {MyRequestFilterOptions, MyRequestSortOptions} from './sort-options'
import Routes from '@app/presentations/navigation/Routes'
import {useWatch} from 'react-hook-form'
import {actions, RootStateType} from '@app/domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {IEffectPayload} from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useCurrentUserInfo, useIsAllowedToOrganizeMyRequest} from '@app/domain/states/user/hooks'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

let debounceSearch: NodeJS.Timeout

const limit = 10

let validationSchema = yup.object().shape({
  type: yup.string().required('Tipe permintaan wajib dipilih'),
  status: yup.string().required('Status permintaan wajib dipilih'),
})

const MyRequestList = () => {
  const isAllowedToOrganizeMyRequest = useIsAllowedToOrganizeMyRequest()
  const user = useCurrentUserInfo()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation: any = useNavigation()
  const routes: any = useRoute()
  const organization = routes.params?.organization
  const division = routes.params?.division
  const month = routes.params?.month
  const year = routes.params?.year

  const [query, setQuery] = useState({
    sort: 'requests_createdAt:desc',
    status: '',
    search: '',
    type: '',
    year: year,
    month: month.value || '',
    divisionId: division?.value || '',
    userId: user?.id,
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
      type: '',
      status: '',
    },
  })

  const [selectedRequest, setSelectedRequest] = useState<IMyRequest | undefined>()

  const {myRequestList, deleteMyRequestStatus}: IRSRequests = useSelector(
    (state: RootStateType) => state?.requestReducer || {},
  )
  const {data: lists, loading}: IEffectPayload = myRequestList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const typeWatcher = useWatch({
    control: control,
    name: 'type',
    defaultValue: control._defaultValues.type || '',
  })

  const statusWatcher = useWatch({
    control: control,
    name: 'status',
    defaultValue: control._defaultValues.status || '',
  })

  const onPopupEdit = (item: IMyRequest) => {
    switch (item.type) {
      case ENUM_REQUEST_TYPE.ALAT:
        navigation.navigate(Routes.MY_REQUEST_FORM_TOOL, {
          request: item,
          parent: {organization, division, month, year: year},
        })
        break
      case ENUM_REQUEST_TYPE.MATERIAL:
        navigation.navigate(Routes.MY_REQUEST_FORM_MATERIAL, {
          request: item,
          parent: {organization, division, month, year: year},
        })
        break

      case ENUM_REQUEST_TYPE.UANG_TUNAI:
        navigation.navigate(Routes.MY_REQUEST_FORM_CASH, {
          request: item,
          parent: {organization, division, month, year: year},
        })
        break

      case ENUM_REQUEST_TYPE.TRANSPORTASI:
        navigation.navigate(Routes.MY_REQUEST_FORM_TRANSPORTATION, {
          request: item,
          parent: {organization, division, month, year: year},
        })
        break

      default:
    }
  }

  const onTap = (item: IMyRequest) => {
    navigation.navigate(Routes.MY_REQUEST_DETAIL, {parent: {organization, division, month, year: year}, item})
  }

  const getData = useCallback(data => {
    dispatch(
      actions.getMyRequestList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    if (typeWatcher != '' && statusWatcher != '') {
      getData({...query, page: 1, limit})
    }
  }, [query])

  useEffect(() => {
    const error = deleteMyRequestStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus permintaan')
    }
    setSelectedRequest(undefined)
  }, [deleteMyRequestStatus?.error])

  useEffect(() => {
    setSelectedRequest(undefined)
    const data = deleteMyRequestStatus?.data?.data
    if (data?.code == 200) {
      refreshData()
      showSuccessToast('Permintaan berhasil dihapus')
    }
  }, [deleteMyRequestStatus?.data])

  const handleSearch = (name: string) => {
    setQuery({...query, search: name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: name, page: 1, limit})
    }, 400)
  }

  const renderItem = ({item}: any) => {
    return (
      <MyRequestCard
        isAllowedToOrganize={isAllowedToOrganizeMyRequest}
        onPopupDelete={() => {
          setSelectedRequest(item)
        }}
        onTap={() => {
          onTap(item)
        }}
        request={item}
        key={item.id}
        onPopupEdit={() => onPopupEdit(item)}
      />
    )
  }

  const handleSort = (v: string) => {
    const newState = {...query, sort: v}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

  const handleFilter = (v: string) => {
    const newState = {...query, status: v}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <SortPopup onSelect={handleSort} options={MyRequestSortOptions} selectedValue={query.sort} />
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

  const AltOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup title="Filter" onSelect={handleFilter} options={MyRequestFilterOptions} selectedValue={query.status} />
    </MenuOptions>
  )

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }

    getData({...query, page: nextPage, limit})
  }

  useEffect(() => {
    if (typeWatcher != '' && statusWatcher != '') {
      setQuery({...query, type: typeWatcher, status: statusWatcher})
      getData({...query, type: typeWatcher, status: statusWatcher, limit, page: 1})
    }
  }, [typeWatcher, statusWatcher, isFocused])

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="Permintaan Gudang"
        headerRight={() =>
          isAllowedToOrganizeMyRequest ? (
            <TouchableOpacity
              onPress={() => {
                const currentMonth = new Date().getMonth() + 1
                if (parseInt(month.value) < currentMonth) {
                  showErrorToast('Bulan yang anda pilih sudah lewat')
                  return
                }

                navigation.navigate(Routes.MY_REQUEST_FORM_FIRST, {parent: {organization, division, month, year: year}})
              }}>
              <MaterialIcon name="plus" size={22} />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ListFilterAlt
        searchValue={query.search}
        onChangeSearch={handleSearch}
        style={styles.filter}
        onPressDownload={() => {}}
        sortOptions={cardOptions}
        // alts={AltOptions}
      />

      <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
        <View style={{flex: 1, marginEnd: 4}}>
          <SelectInput
            hideLabel={true}
            isRequired
            errorText={errors?.type?.message}
            control={control}
            name={'type'}
            placeholder="Tipe permintaan"
            items={REQUEST_TYPE}
          />
        </View>
        <View style={{flex: 1, marginStart: 4}}>
          <SelectInput
            hideLabel={true}
            isRequired
            errorText={errors?.status?.message}
            control={control}
            name={'status'}
            placeholder="Status permintaan"
            items={REQUEST_STATUS}
          />
        </View>
      </View>

      <View style={{flex: 1, paddingHorizontal: 16}}>
        <FlatList
          ListHeaderComponent={
            <>
              <MyRequestDetailInfo data={{organization, division, month, year: year}} />
            </>
          }
          data={typeWatcher == '' || statusWatcher == '' ? [] : docs}
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
        onPositiveButtonTap={() => {
          dispatch(actions.deleteMyRequest.request({loading: true, data: selectedRequest?.id}))
          setSelectedRequest(undefined)
        }}
        isDanger={true}
        isOpen={selectedRequest != undefined}
        onTouchOutside={() => {
          setSelectedRequest(undefined)
        }}
        title={'Anda yakin ingin menghapus permintaan ini?'}
        description={'Data di dalamnya akan dihapus dan tidak dapat dikembalikan lagi'}
        positiveButtonText={'Hapus'}
      />
    </SafeAreaView>
  )
}

export default MyRequestList

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
})
