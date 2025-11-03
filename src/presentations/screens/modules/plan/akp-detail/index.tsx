import {Header, ListFilter, ModalAsk, Text} from '@components/index'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import DetailInfo from './akp-detail-info'
import {ScrollView} from 'react-native-gesture-handler'
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'
import EmptyList from '@components/Empty'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@domain/states/store'
import LineCard from '../akp-form/line-card'
import {showErrorToast, showSuccessToast} from '@components/Toast'
import {AkpLine, IAKPRow} from '@app/models/eplant/AKP'
import {useIsAllowedToOrganizeAKP} from '@app/domain/states/user/hooks'

const AKPDetail = () => {
  const isAllowedToOrganizeAKP = useIsAllowedToOrganizeAKP()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const ORGANIZATION: any = route?.params?.parent?.ORGANIZATION
  const DIVISION: any = route?.params?.parent?.DIVISION
  const DATE: any = route?.params?.parent?.DATE
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const itemParam = route.params?.item
  const [item, setItem] = useState(itemParam)
  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const {akpDetail, deleteAKPStatus} = useSelector((state: RootStateType) => state.akp)
  const [search, setSearch] = useState('')
  const lines = item?.akpLines || []
  const linesFiltered = search.length > 0 ? lines.filter((e: AkpLine) => e.numbersOfLines === search) : lines

  useEffect(() => {
    if (isFocused) {
      dispatch(actions.getAKPDetail.request({loading: true, data: item.id}))
    }
  }, [isFocused])

  const onPopupDelete = (item?: IAKPRow) => {
    if (item) {
      setModalAskOpen(true)
    }
  }

  const handleDelete = () => {
    dispatch(actions.deleteAKP.request({loading: true, data: item}))
    setModalAskOpen(false)
  }

  useEffect(() => {
    if (!!akpDetail?.data?.numberAkp && akpDetail?.data?.id === item.id) {
      setItem(akpDetail?.data)
    }
  }, [akpDetail?.data])

  useEffect(() => {
    const error = deleteAKPStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteAKPStatus?.error])

  useEffect(() => {
    const data = deleteAKPStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteAKPStatus?.data])

  const HeaderView = () => <Header title="Detail AKP" />

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus AKP ini?'}
      description={'Menghapus AKP akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const renderLine = (item: AkpLine) => <LineCard key={item.numbersOfLines} item={item} />

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView>
        <DetailInfo
          ORGANIZATION={ORGANIZATION}
          DIVISION={DIVISION}
          DATE={DATE}
          isAllowedToOrganizeAKP={isAllowedToOrganizeAKP}
          item={item}
          onPopupDelete={onPopupDelete}
        />
        <View style={styles.blockHeaderView}>
          <Text type="bold" size={12}>
            Baris Terkait
          </Text>
          <ListFilter style={{flex: 1, marginRight: 0}} searchValue={search} onChangeSearch={v => setSearch(v)} />
        </View>
        <View style={{marginHorizontal: 18}}>
          {linesFiltered.length > 0 ? linesFiltered?.map(renderLine) : <EmptyList />}
        </View>
      </ScrollView>
      <ModalDelete />
    </SafeAreaView>
  )
}

export default AKPDetail

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
