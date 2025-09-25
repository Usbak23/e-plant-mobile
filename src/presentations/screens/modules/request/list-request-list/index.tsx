import {ENUM_REQUEST_TYPE, IMyRequest, IProcessRequest, REQUEST_STATUS, REQUEST_TYPE} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {
  Button,
  Header,
  ListFilterAlt,
  Loader,
  ModalAsk,
  ModalGeneral,
  SelectInput,
  SortPopup,
  Text,
  TextInput as TI,
} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import {MyRequestSortOptions} from './sort-options'
import Routes from '@app/presentations/navigation/Routes'
import {useWatch} from 'react-hook-form'
import {actions, RootStateType} from '@app/domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {IEffectPayload} from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useCurrentUserInfo, useIsAllowedToOrganizeListOfRequest} from '@app/domain/states/user/hooks'
import ListRequestDetailInfo from './list-request-detail-info'
import ListRequestCard from './list-request-card'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MyRequestFilterOptions} from '../my-request-list/sort-options'

let debounceSearch: NodeJS.Timeout

const limit = 10

let validationSchema = yup.object().shape({
  type: yup.string().required('Tipe permintaan wajib dipilih'),
  status: yup.string().required('Status permintaan wajib dipilih'),
})

let validationSchemaRejection = yup.object().shape({
  notes: yup.string().required('Tulis alasan penolakan').typeError('Alasan penolakan wajib diisi'),
})

const ListRequestList = () => {
  const isAllowedToOrganizeListOfRequest = useIsAllowedToOrganizeListOfRequest()
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
  })

  const resolver = useYupValidationResolver(validationSchema)
  const resolverRejection = useYupValidationResolver(validationSchemaRejection)

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

  const {
    handleSubmit: handleSubmitRejection,
    control: controlRejection,
    setValue: setValueRejection,
    getValues: getValuesRejection,
    formState: {errors: errorsRejection, isValid: isValidRejection, isDirty: isDirtyRejection},
  } = useForm({
    resolver: resolverRejection,
    mode: 'onChange',
    defaultValues: {
      notes: '',
    },
  })

  const onSubmitRejection = (form: any) => {
    Object.assign(form, {
      id: selectedRequest?.id,
      status: 'Ditolak',
    })

    dispatch(actions.processRequest.request({loading: true, data: form}))
    setSelectedRequest(undefined)
    setValueRejection('notes', '')
  }

  const [selectedRequest, setSelectedRequest] = useState<IMyRequest | undefined>()

  const {myRequestList, processRequestStatus}: IRSRequests = useSelector(
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

  const onTap = (item: IMyRequest) => {
    navigation.navigate(Routes.LIST_OF_REQUEST_DETAIL, {parent: {organization, division, month, year: year}, item})
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
    const error = processRequestStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menolak permintaan')
    }
    setSelectedRequest(undefined)
  }, [processRequestStatus?.error])

  useEffect(() => {
    setSelectedRequest(undefined)
    const data = processRequestStatus?.data?.data
    if (data?.code == 200) {
      refreshData()
      showInfoToast('Perubahan disimpan')
    }
  }, [processRequestStatus?.data])

  const handleSearch = (name: string) => {
    setQuery({...query, search: name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: name, page: 1, limit})
    }, 400)
  }

  const renderItem = ({item}: any) => {
    return (
      <ListRequestCard
        isAllowedToOrganize={isAllowedToOrganizeListOfRequest}
        onPopupAccept={() => {
          const obj: IProcessRequest = {
            id: item.id,
            status: 'Disetujui',
          }
          dispatch(actions.processRequest.request({loading: true, data: obj}))
        }}
        onPopupReject={() => {
          setSelectedRequest(item)
        }}
        onTap={() => {
          onTap(item)
        }}
        request={item}
        key={item.id}
      />
    )
  }

  const handleSort = (v: string) => {
    const newState = {...query, sort: v}
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

  const handleFilter = (v: string) => {
    const newState = {...query, status: v}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

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
      <Header title="Daftar Permintaan Gudang" />
      <Loader loading={Boolean(processRequestStatus?.loading)} />
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
              <ListRequestDetailInfo data={{organization, division, month, year: year}} />
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

      <Modal animationType="fade" key={'modal-reject'} transparent={true} visible={Boolean(selectedRequest)}>
        <TouchableOpacity
          testID="onTouchOutsideButton"
          onPress={() => {
            setValueRejection('notes', '')
            setSelectedRequest(undefined)
          }}
          style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text type="semibold">Tolak Permintaan</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setValueRejection('notes', '')
                    setSelectedRequest(undefined)
                  }}>
                  <Icon name="close" size={20} color={theme.colors.textThinBlack} />
                </TouchableOpacity>
              </View>
              <Text type="semibold" size={12} style={[{marginVertical: 16}]} color={theme.colors.textThinBlack}>
                Berikan alasan terhadap permintaan yang ditolak pada kolom di bawah ini
              </Text>
              <TI
                errorText={errorsRejection?.notes?.message}
                multiline={true}
                isRequired
                maxLines={5}
                placeholder="Masukkan alasan penolakan"
                label="Alasan"
                control={controlRejection}
                name={'notes'}
              />

              <Button onPress={handleSubmitRejection(onSubmitRejection)}>
                <Text color="white">Tolak Permintaan</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default ListRequestList

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
