import {theme} from '@app/presentations/utils/styles'
import {Button, Header, ModalAsk, Text} from '@app/presentations/_shared-components'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BlockDetailInfo from './block-detail-info'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {IBlockRow} from '@app/models/eplant/Block'
import {actions, RootStateType} from '@domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import Routes from '@app/presentations/navigation/Routes'
import {useTphByBlocksFull} from '@app/domain/states/tph/hooks'
import {ITPHRow, ITPHRowAll} from '@app/models/eplant/TPH'
import Card from '../tph-list/tph-card'
import {IRSTPH} from '@app/domain/states/tph/reducer'
import ModalInfo from '@components/ModalInfo'
import {
  useIsAllowedToOrganizeBlock,
  useIsAllowedToOrganizeTPH,
  useIsAllowedToSeeTPH,
} from '@app/domain/states/user/hooks'

interface IBlockDetailProps {}

const BlockDetail: React.FC<IBlockDetailProps> = props => {
  const isAllowedToSeeTPH = useIsAllowedToSeeTPH()
  const isAllowedToOrganizeTPH = useIsAllowedToOrganizeTPH()
  const isAllowedToOrganizeBlock = useIsAllowedToOrganizeBlock()
  const routes: any = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const block = routes.params?.item
  const isFocused = useIsFocused()

  const [selected, setSelected] = useState<ITPHRow | undefined>()

  const [isModalAskOpen, setModalAskOpen] = useState<boolean>(false)
  const {deleteBlockStatus} = useSelector((state: RootStateType) => state.block)
  const [item, setItem] = useState(block)
  const blockDetail = useSelector((state: RootStateType) => state.block.blockDetail)
  const relatedTPH = useTphByBlocksFull(block.id)
  const {deleteTPHStatus}: IRSTPH = useSelector((state: RootStateType) => state?.tph || {})
  const [modalInfo, setModalInfo] = useState<{isOpen: boolean; isDanger: boolean; message: string}>({
    isOpen: false,
    isDanger: false,
    message: '',
  })

  const onPopupEdit = (v?: IBlockRow) => {
    //@ts-expect-error
    navigation.navigate(Routes.BLOCK_FORM, {
      item: v,
    })
  }

  const onPopupDelete = (v?: IBlockRow) => {
    if (v) {
      setModalAskOpen(true)
    }
  }

  const getAllTPH = () =>
    dispatch(
      actions.getTPHAll.request({
        loading: true,
        data: {
          block: item.id,
        },
      }),
    )

  const handleDelete = () => {
    dispatch(actions.deleteBlock.request({loading: true, data: item?.id}))
    setModalAskOpen(false)
  }

  useEffect(() => {
    if (blockDetail?.data?.id === item.id) {
      setItem(blockDetail?.data)
    }
  }, [blockDetail?.data])

  useEffect(() => {
    const error = deleteBlockStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [deleteBlockStatus?.error])

  useEffect(() => {
    const data = deleteBlockStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Data berhasil dihapus')
      navigation.goBack()
    }
  }, [deleteBlockStatus?.data])

  useEffect(() => {
    if (isFocused) {
      getAllTPH()
      dispatch(actions.detailBlock.request({loading: true, data: item?.id}))
    }
  }, [isFocused])

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
      setModalInfo({
        ...modalInfo,
        isDanger: false,
        isOpen: true,
        message: '',
      })
      getAllTPH()
      dispatch(actions.detailBlock.request({loading: true, data: item?.id}))
    }
  }, [deleteTPHStatus?.data])

  const ModalDelete = () => (
    <ModalAsk
      onPositiveButtonTap={() => handleDelete()}
      isDanger={true}
      isOpen={isModalAskOpen}
      onTouchOutside={() => setModalAskOpen(false)}
      title={'Anda yakin ingin menghapus blok ini?'}
      description={'Menghapus blok akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const ModalDeleteTPH = () => (
    <ModalAsk
      onPositiveButtonTap={() => {
        if (selected) {
          dispatch(actions.deleteTPH.request({loading: true, data: selected.id}))
        }
        setSelected(undefined)
      }}
      isDanger={true}
      isOpen={selected != undefined}
      onTouchOutside={() => setSelected(undefined)}
      title={'Anda yakin ingin menghapus TPH ini?'}
      description={'Menghapus TPH akan menghapus data di dalamnya dan tidak dapat dikembalikan'}
      positiveButtonText={'Hapus'}
    />
  )

  const HeaderView = () => <Header title="Detail Blok" />

  const TPHHeaderView = () => (
    <View style={styles.blockHeaderView}>
      {isAllowedToSeeTPH ? (
        <Text type="bold" size={fs(11)}>
          TPH Terkait
        </Text>
      ) : (
        <View />
      )}

      {isAllowedToOrganizeTPH ? (
        <Button
          style={styles.addTPHButton}
          onPress={() => {
            navigation.navigate(Routes.TPH_FORM, {
              module: item,
            })
          }}>
          <Text size={fs(10)} style={styles.addTPHButtonText}>
            Tambah TPH
          </Text>
        </Button>
      ) : (
        <View />
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView>
        <BlockDetailInfo
          isAllowedToOrganizeBlock={isAllowedToOrganizeBlock}
          onPopupEdit={onPopupEdit}
          onPopupDelete={onPopupDelete}
          block={item}
        />
        <TPHHeaderView />
        {isAllowedToSeeTPH &&
          relatedTPH.map((tph: ITPHRowAll, index: number) => (
            <Card
              isAllowedToOrganizeTPH={isAllowedToOrganizeTPH}
              key={index}
              module={block}
              item={tph}
              onDelete={item => setSelected(item)}
            />
          ))}
      </ScrollView>
      <ModalDelete />
      <ModalDeleteTPH />
      <ModalInfo
        title={modalInfo.isDanger ? 'Anda tidak dapat menghapus tph ini' : 'TPH berhasil dihapus'}
        description={modalInfo.isDanger ? modalInfo.message : undefined}
        isDanger={modalInfo.isDanger}
        isOpen={modalInfo.isOpen}
        onTouchOutside={() => setModalInfo({...modalInfo, isOpen: false})}
        onPositiveButtonTap={() => setModalInfo({...modalInfo, isOpen: false})}
      />
    </SafeAreaView>
  )
}

export default BlockDetail

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  blockHeaderView: {
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addTPHButton: {
    backgroundColor: theme.colors.black,
  },
  addTPHButtonText: {
    fontSize: fs(10),
    color: theme.colors.white,
  },
})
