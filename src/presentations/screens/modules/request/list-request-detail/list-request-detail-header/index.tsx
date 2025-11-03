import IOption from '@app/models/commons/IOption'
import {ENUM_REQUEST_TYPE, IMyRequest} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {ArrayTextWithMoreButton, ModalAsk, ModalGeneral, Text} from '@app/presentations/_shared-components'
import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import IconOrganizarion from '@assets/icons/ic_small_organization.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconDivision from '@assets/icons/menus/master-data-menus/ic_division.svg'
import IconBlock from '@assets/icons/ic_block.svg'
import IconQuantity from '@assets/icons/ic_small_column_triple.svg'
import IconTypeRequest from '@assets/icons/menus/ic_news.svg'
import IconSubActivity from '@assets/icons/ic_book.svg'
import IconPerson from '@assets/icons/ic_small_people.svg'
import IconClock from '@assets/icons/menus/ic_harvesting.svg'
import IconRequestReason from '@assets/icons/ic_request_reason.svg'
import IconFork from '@assets/icons/ic_request.svg'
import IconBuilding from '@assets/icons/ic_small_building.svg'

import moment from 'moment'
import Entypo from 'react-native-vector-icons/Entypo'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {IMyRequestBlock, IMyRequestDetail, IRequestHistory} from '@app/models/eplant/MyRequest'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import Icon from 'react-native-vector-icons/MaterialIcons'
import numberWithDot from '@app/presentations/utils/numberWithDot'

interface IProps {
  isAllowedToOrganize?: boolean
  item: IMyRequest
  itemDetail?: IMyRequestDetail
  parent?: any
  onAccept?: Function
  onReject?: Function
}

const ICON_SIZE = 17
const ListRequestDetailHeader = ({item, itemDetail, parent, onAccept = () => {}, onReject = () => {}, isAllowedToOrganize = false}: IProps) => {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const [modalBlok, setModalBlok] = useState<boolean>(false)
  const [selectedRequest, setSelectedRequest] = useState<undefined | IMyRequest>(undefined)
  // const {deleteMyRequestStatus}: IRSRequests = useSelector((state: RootStateType) => state.requestReducer)

  const labelType = (): string => {
    if (item?.type == ENUM_REQUEST_TYPE.ALAT) {
      return 'Item'
    } else if (item?.type == ENUM_REQUEST_TYPE.MATERIAL) {
      return 'Material'
    } else if (item?.type == ENUM_REQUEST_TYPE.TRANSPORTASI) {
      return 'Transportasi'
    }
    return 'Sub Aktv / Item / Material'
  }

  const labelValue = (): string => {
    if (item?.type == ENUM_REQUEST_TYPE.ALAT) {
      return itemDetail?.item?.name || '-'
    } else if (item?.type == ENUM_REQUEST_TYPE.MATERIAL) {
      return itemDetail?.material?.name || '-'
    } else if (item?.type == ENUM_REQUEST_TYPE.TRANSPORTASI) {
      return itemDetail?.item?.name || '-'
    }
    return '-'
  }

  const reasonOfRejection = (): string => {
    const histories = itemDetail?.requestHistories || []
    if (histories.length > 0) {
      histories.sort((a: IRequestHistory, b: IRequestHistory) => new Date(a.date) - new Date(b.date))
      const latestRejectedHistory =
        histories[histories.length - 1].status == 'Ditolak' || histories[histories.length - 1].status == 'Tolak'
          ? histories[histories.length - 1].notes || '-'
          : '-'
      return latestRejectedHistory
    }
    return '-'
  }

  const blockCodes = () => {
    if (
      Array.isArray(itemDetail?.requestBlocks) &&
      itemDetail?.requestBlocks &&
      itemDetail?.requestBlocks?.length > 0
    ) {
      return itemDetail?.requestBlocks.map((block: IMyRequestBlock) => {
        return block?.block?.code
      })
    }
    return []
  }

  const AcceptButton = () => (
    <TouchableOpacity onPress={() => onAccept()}>
      <View style={styles.optButton}>
        <Icon
          style={{backgroundColor: theme.colors.tealDark, borderRadius: 17, padding: 2}}
          size={ICON_SIZE}
          name="check"
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )

  const RejectButton = () => (
    <TouchableOpacity onPress={() => onReject()}>
      <View style={[styles.optButton]}>
        <Icon
          style={{backgroundColor: theme.colors.redDark, borderRadius: 17, padding: 2}}
          size={ICON_SIZE}
          name="close"
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )

  const [textLength, setTextLength] = useState(0)
  const [textLengthRejection, setTextLengthRejection] = useState(0)

  const onTextLayout = useCallback(e => {
    setTextLength(e.nativeEvent.lines.length)
  }, [])

  const onTextLayoutRejection = useCallback(e => {
    setTextLengthRejection(e.nativeEvent.lines.length)
  }, [])

  const onMoreTap = () => {
    if (!itemDetail) {
      showInfoToast('Sedang memuat data. Tunggu sebentar...')
      return
    }

    //@ts-ignore
    navigation.navigate(Routes.COMMON_INFORMATION_LONG, {
      description: itemDetail?.purpose || '-',
      title: 'Tujuan Permintaan',
    })
  }

  const onMoreTapRejection = () => {
    if (!itemDetail) {
      showInfoToast('Sedang memuat data. Tunggu sebentar...')
      return
    }
    //@ts-ignore
    navigation.navigate(Routes.COMMON_INFORMATION_LONG, {
      description: reasonOfRejection() || '-',
      title: 'Alasan',
    })
  }

  return (
    <>
      <ModalGeneral
        title={'Blok'}
        description={blockCodes().join(', ')}
        isOpen={modalBlok}
        onTouchOutside={() => setModalBlok(false)}
      />

      <ModalAsk
        onPositiveButtonTap={() => {
          dispatch(actions.deleteMyRequest.request({loading: true, data: item?.id}))
          setSelectedRequest(undefined)
        }}
        isDanger={true}
        isOpen={selectedRequest != undefined}
        onTouchOutside={() => {
          setSelectedRequest(undefined)
        }}
        title={'Anda yakin ingin menghapus permintaan ini?'}
        description={'Data yang dihapus tidak dapat dikembalikan lagi'}
        positiveButtonText={'Hapus'}
      />

      <View style={styles.root}>
        <View style={{flexDirection: 'row', marginHorizontal: 8, alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text type="semibold">{itemDetail?.requestNumber || item?.requestNumber || '-'}</Text>
          </View>
          {
            isAllowedToOrganize ? itemDetail?.status == 'Menunggu Persetujuan' && (
              <View style={{flexDirection: 'row'}}>
                <AcceptButton />
                <RejectButton />
              </View>
            ) : null
          }


        </View>

        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconFork width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Permintaan
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.name || item?.name || '-'}
              </Text>
            </View>
          </View>
          <View style={[styles.itemWrapper]}>
            <View style={styles.smallIconView}>
              <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Tanggal
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {moment(item?.date).format('DD MMMM YYYY') || '-'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconBuilding width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Organisasi
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.division?.organization?.name || '-'}
              </Text>
            </View>
          </View>
          <View style={[styles.itemWrapper]}>
            <View style={styles.smallIconView}>
              <IconOrganizarion width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Divisi
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.division?.name || '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconBlock width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Blok
              </Text>

              {!itemDetail?.requestBlocks ||
              (Array.isArray(itemDetail?.requestBlocks) && itemDetail?.requestBlocks.length == 0) ? (
                <Text>-</Text>
              ) : (
                <ArrayTextWithMoreButton
                  onMorePress={() => {
                    setModalBlok(true)
                  }}
                  textSize={12}
                  arrayOfText={blockCodes()}
                />
              )}
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconQuantity width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                {item?.type == 'Uang Tunai' ? 'Jumlah' : 'Kuantitas'}
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.qty != undefined && itemDetail?.type == 'Uang Tunai'
                  ? `Rp${numberWithDot(itemDetail?.qty || 0)}`
                  : itemDetail?.qty || '-'}{' '}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconTypeRequest width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Tipe Permintaan
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.type || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconSubActivity width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                {labelType()}
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {labelValue()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconPerson width={ICON_SIZE} height={ICON_SIZE} />
              {/* <IconSubActivity width={ICON_SIZE} height={ICON_SIZE} /> */}
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Pengaju
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.user?.name || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconClock width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Status
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.status || item?.status || '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconRequestReason width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Tujuan Permintaan
              </Text>
              {/* <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.purpose || item?.purpose || '-'}
              </Text> */}
              <Text maxLines={2} onTextLayout={onTextLayout} color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.purpose || '-'}
              </Text>
              {textLength >= 3 && (
                <TouchableOpacity onPress={() => onMoreTap()}>
                  <Text size={11} type="semibold" style={{textDecorationLine: 'underline'}}>
                    Lihat selengkapnya
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconRequestReason width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Alasan Penolakan
              </Text>
              <Text maxLines={2} onTextLayout={onTextLayoutRejection} color={theme.colors.textThinBlack} size={12}>
                {reasonOfRejection() || '-'}
              </Text>
              {textLengthRejection >= 3 && (
                <TouchableOpacity onPress={() => onMoreTapRejection()}>
                  <Text size={11} type="semibold" style={{textDecorationLine: 'underline'}}>
                    Lihat selengkapnya
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

export default ListRequestDetailHeader

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: theme.colors.lightGrey,
  },
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    // marginHorizontal: -6,
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  itemTitle: {
    color: '#9C9C9C',
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftSpacer: {
    marginStart: 8,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
  optButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    margin: 4,
    borderColor: theme.colors.grey,
  },
})
