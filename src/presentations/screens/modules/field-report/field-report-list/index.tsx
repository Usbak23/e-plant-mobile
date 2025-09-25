import {ENUM_REQUEST_TYPE, IMyRequest} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {Header, Loader, ModalAsk, SortPopup} from '@app/presentations/_shared-components'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EmptyList from '@app/presentations/_shared-components/Empty'
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import {FieldReportSortOptions} from './sort-options'
import Routes from '@app/presentations/navigation/Routes'
import {actions, RootStateType} from '@app/domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {IEffectPayload} from '@app/domain/states/types'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'

import ListFieldReportDetailInfo from './field-report-detail-info'
import ListFieldReportCard from './field-report-card'
import {IFieldReport} from '@app/models/eplant/FieldReport'
import {IRSFieldReport} from '@app/domain/states/field-report/reducers'
import {
  useCurrentUserInfo,
  useIsAllowedToOrganizeFieldReport,
  useIsAllowedToOrganizeWarehouseManagement,
} from '@app/domain/states/user/hooks'
let debounceSearch: NodeJS.Timeout

const limit = 10

const FieldReportList = () => {
  const isAllowedToOrganize = useIsAllowedToOrganizeFieldReport()
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
    sort: 'officialReports_createdAt:desc',
    search: '',
    year: year,
    month: month.value || '',
    divisionId: division?.value || '',
  })

  const [selectedFieldReport, setSelectedFieldReport] = useState<IFieldReport | undefined>()

  const {fieldReportList, deleteFieldReportStatus, fieldReportDetail}: IRSFieldReport = useSelector(
    (state: RootStateType) => state?.fieldReportReducer || {},
  )
  const {data: lists, loading}: IEffectPayload = fieldReportList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const onPopupEdit = (item: IFieldReport) => {
    navigation.navigate(Routes.FIELD_REPORT_FORM, {parent: {organization, division, month, year: year}, item})
  }

  const onTap = (item: IFieldReport) => {
    navigation.navigate(Routes.FIELD_REPORT_DETAIL, {parent: {organization, division, month, year: year}, item})
  }

  const getData = useCallback(data => {
    dispatch(
      actions.getFieldReportList.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  useEffect(() => {
    const error = deleteFieldReportStatus?.error
    if (error) {
      showErrorToast(error?.message || 'Gagal menghapus berita cara')
    }
    setSelectedFieldReport(undefined)
  }, [deleteFieldReportStatus?.error])

  useEffect(() => {
    setSelectedFieldReport(undefined)
    const data = deleteFieldReportStatus?.data?.data
    if (data?.code == 200) {
      refreshData()
      showSuccessToast('Berita acara berhasil dihapus')
    }
  }, [deleteFieldReportStatus?.data])

  const handleSearch = (name: string) => {
    setQuery({...query, search: name})
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, search: name, page: 1, limit})
    }, 400)
  }

  const renderItem = ({item}: any) => {
    return (
      <ListFieldReportCard
        user={user}
        onPopupDelete={() => {
          setSelectedFieldReport(item)
        }}
        onTap={() => {
          onTap(item)
        }}
        item={item}
        key={item.id}
        onPopupEdit={() => onPopupEdit(item)}
        isAllowedToOrganize={isAllowedToOrganize}
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
      <SortPopup onSelect={handleSort} options={FieldReportSortOptions} selectedValue={query.sort} />
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

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }

    getData({...query, page: nextPage, limit})
  }

  useEffect(() => {
    setQuery({...query})
    getData({...query, limit, page: 1})
  }, [isFocused])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Berita Acara" />
      <Loader loading={Boolean(fieldReportDetail?.loading)} />
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

        {isAllowedToOrganize ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(Routes.FIELD_REPORT_FORM, {parent: {organization, division, month, year: year}})
            }}
            style={styles.button}>
            <AntDesign name="plus" size={14} color={theme.colors.textThinBlack} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{flex: 1, padding: 16}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListFieldReportDetailInfo data={{organization, division, month, year: year}} />}
          data={docs}
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
          dispatch(actions.deleteFieldReport.request({loading: true, data: selectedFieldReport?.id}))
          setSelectedFieldReport(undefined)
        }}
        isDanger={true}
        isOpen={selectedFieldReport != undefined}
        onTouchOutside={() => {
          setSelectedFieldReport(undefined)
        }}
        title={'Anda yakin ingin menghapus berita acara ini?'}
        description={'Data di dalamnya akan dihapus dan tidak dapat dikembalikan lagi'}
        positiveButtonText={'Hapus'}
      />
    </SafeAreaView>
  )
}

export default FieldReportList

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
