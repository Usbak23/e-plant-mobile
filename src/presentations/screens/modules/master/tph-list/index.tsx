import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Keyboard,
} from 'react-native'
import {useIsFocused, useNavigation} from '@react-navigation/core'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import Header from '@components/Header'
import Routes from '@app/presentations/navigation/Routes'
import Entypo from 'react-native-vector-icons/Entypo'
import Card from './tph-card'
import ListFilter from '@components/ListFilter'
import {IEffectPayload} from '@domain/states/types'
import EmptyList from '@components/Empty'
import FlatListFooter from '@components/FlatListFooter'
import {theme} from '@app/presentations/utils/styles'
import {SortOptions} from './sort-options'
import {Button, SelectInput, SortPopup, Text} from '@components/index'
import {MenuOptions} from 'react-native-popup-menu'
import ModalAsk from '@components/ModalAsk'
import {showSuccessToast} from '@components/Toast'
import System from '@app/domain/services/System'
import {IRSTPH} from '@app/domain/states/tph/reducer'
import {ITPHRow} from '@app/models/eplant/TPH'
import ModalFilter from '@components/ModalFilter'
import ModalInfo from '@components/ModalInfo'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import {useIsAllowedToOrganizeTPH} from '@app/domain/states/user/hooks'

let debounceSearch: NodeJS.Timeout

export default function TPHList() {
  const isAllowedToOrganizeTPH = useIsAllowedToOrganizeTPH()
  const navigation: any = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const limit = 10
  const [query, setQuery] = useState({
    sort: 'createdAt:desc',
    name: '',
    organization: '',
    division: '',
    block: '',
  })
  const [selected, setSelected] = useState<ITPHRow>()
  const [modalFilter, setModalFilter] = useState(false)
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const {tphList, deleteTPHStatus, formTPHStatus}: IRSTPH = useSelector((state: RootStateType) => state?.tph || {})
  const {data: lists, loading}: IEffectPayload = tphList || {loading: false}
  const {docs, hasNextPage, nextPage, page} = lists || {docs: [], page: 1}

  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(query.organization)
  const blocks = useBlocksByDivisionStd(query.division)

  const getData = useCallback(data => {
    dispatch(
      actions.getTPHLists.request({
        loading: true,
        data,
      }),
    )
  }, [])

  const handleSearch = (name: string) => {
    setQuery({...query, name})
    // TODO: PLease move debounce to epics
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      getData({...query, name, page: 1, limit})
    }, 400)
  }

  const handleDelete = () => {
    dispatch(actions.deleteTPH.request({loading: true, data: selected?.id}))
    setSelected(undefined)
  }

  const refreshData = useCallback(() => {
    getData({...query, page: 1, limit})
  }, [query])

  const getNextPage = () => {
    if (loading || !hasNextPage) {
      return
    }
    getData({...query, page: nextPage})
  }

  const handleFilter = () => {
    getData({...query, page: 1, limit})
    setModalFilter(false)
  }

  const onAdd = () => {
    navigation.navigate(Routes.TPH_FORM)
  }

  const handleSort = (sort: string) => {
    const newState = {...query, sort}
    setQuery(newState)
    getData({...newState, page: 1, limit})
  }

  const sortOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 8,
        },
      }}>
      <SortPopup onSelect={handleSort} options={SortOptions} selectedValue={query.sort} />
    </MenuOptions>
  )

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={handleDelete}
      isDanger={true}
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus TPH ini?'}
      description={'Menghapus TPH akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  useEffect(() => {
    const error = deleteTPHStatus?.error
    if (error) {
      setModalInfo({
        ...modalInfo,
        isDanger: true,
        isOpen: true,
        message: error.message,
      })
    }
    setSelected(undefined)
  }, [deleteTPHStatus?.error])

  useEffect(() => {
    setSelected(undefined)
    const data = deleteTPHStatus?.data?.data
    if (data?.code == '200') {
      refreshData()
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
    }
  }, [deleteTPHStatus?.data])

  useEffect(() => {
    if (isFocused) {
      refreshData()
    }
  }, [isFocused])

  useEffect(() => {
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
    dispatch(actions.getAllBlock.request({loading: true}))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Header title="TPH" headerRight={isAllowedToOrganizeTPH ? () => <PlusButton onPress={onAdd} /> : undefined} />
      <ListFilter
        style={styles.filter}
        searchValue={query.name}
        onChangeSearch={handleSearch}
        onPressFilter={() => setModalFilter(true)}
        sortOptions={sortOptions}
      />
      <FlatList
        onScrollBeginDrag={Keyboard.dismiss}
        data={docs}
        style={styles.list}
        keyExtractor={item => item.id}
        initialNumToRender={limit}
        onEndReachedThreshold={0.5}
        onEndReached={getNextPage}
        ListFooterComponent={() => <FlatListFooter loading={Boolean(docs.length > 0 && loading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(loading)} onRefresh={refreshData} />
          ) : undefined
        }
        renderItem={props => (
          <Card isAllowedToOrganizeTPH={isAllowedToOrganizeTPH} {...props} onDelete={item => setSelected(item)} />
        )}
      />
      <ModalDelete />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus tph ini' : 'TPH berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
      <ModalFilter isOpen={modalFilter} onTouchOutside={() => setModalFilter(false)}>
        <Text type="semibold" size={13} color="#000000">
          Filter Berdasarkan
        </Text>
        <SelectInput
          containerStyle={styles.filterInput}
          items={organizations}
          value={query.organization}
          isRequired
          placeholder="Organisasi"
          onChange={organization => setQuery({...query, division: '', block: '', organization})}
        />
        <SelectInput
          containerStyle={styles.filterInput}
          items={divisions}
          value={query.division}
          isRequired
          placeholder="Divisi"
          onChange={division => setQuery({...query, block: '', division})}
        />
        <SelectInput
          containerStyle={[styles.filterInput, {marginBottom: 5}]}
          items={blocks}
          value={query.block}
          isRequired
          placeholder="Blok"
          onChange={block => setQuery({...query, block})}
        />
        <Button style={{width: '100%'}} onPress={handleFilter}>
          <Text color="white">Filter</Text>
        </Button>
      </ModalFilter>
    </SafeAreaView>
  )
}

const PlusButton = ({onPress}: any) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name="plus" size={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {marginTop: 16},
  filter: {marginTop: 8},
  filterInput: {
    marginVertical: -8,
  },
})
