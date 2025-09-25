import IOption from '@app/models/commons/IOption'
import {ENUM_REQUEST_TYPE, IMyRequest} from '@app/models/eplant/Request'
import {theme} from '@app/presentations/utils/styles'
import {ArrayTextWithMoreButton, Button, ModalAsk, ModalGeneral, Text} from '@app/presentations/_shared-components'
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
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import Icon from 'react-native-vector-icons/MaterialIcons'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {IManagementWarehouse, IManagementWarehouseDetail} from '@app/models/eplant/WarehouseManagement'

interface IProps {
  item?: IManagementWarehouse
  itemDetail?: IManagementWarehouseDetail
  parent?: any
  onAccept?: Function
  onReject?: Function
  onMoreTap?: Function
  onDownload?: Function
  isAllowedToOrganize?: boolean
}

const ICON_SIZE = 17
const WarehouseManagementDetailInfo = ({
  item,
  itemDetail,
  parent,
  onAccept = () => {},
  onReject = () => {},
  onMoreTap = () => {},
  onDownload = () => {},
  isAllowedToOrganize = false,
}: IProps) => {
  const navigation: any = useNavigation()
  const [modalBlok, setModalBlok] = useState<boolean>(false)
  const [textLength, setTextLength] = useState(0)
  const onTextLayout = useCallback(e => {
    setTextLength(e.nativeEvent.lines.length)
  }, [])

  const blockCodes = () => {
    const blocks = itemDetail?.request?.blocks || ''
    const blockCodes = blocks.split(',').map((block: string) => {
      return block.trim()
    })
    const trimmed: string[] = []
    blockCodes.forEach((element: string) => {
      if (element != '') {
        trimmed.push(element)
      }
    })
    return trimmed || []
  }

  const isHaveBpuNaming = () => {
    if (itemDetail?.bpus && itemDetail?.bpus?.length > 0) {
      return 'Ubah Untilan'
    } else if (itemDetail?.bpus && itemDetail?.bpus?.length === 0) {
      return 'Tambah Untilan'
    }
    return 'Tambah Untilan'
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption
        onSelect={() => {
          onAccept()
        }}>
        <PopupEditDelete iconName="call-made" text="Keluarkan" />
      </MenuOption>
      <MenuOption
        value={1}
        onSelect={() => {
          navigation.navigate(Routes.WAREHOUSE_MANAGEMENT_BPU, {item, parent})
        }}>
        <PopupEditDelete iconName="add" text={isHaveBpuNaming()} />
      </MenuOption>
    </MenuOptions>
  )

  const MenuButton = () => (
    <Menu>
      <MenuTrigger>
        <View style={{padding: 10}}>
          <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )

  const shouldShowButtons = () => {
    if (item?.status == 'Menunggu Persetujuan') {
      if (item?.requestType != 'Material') {
        return (
          <>
            <Button
              onPress={() => {
                onAccept()
              }}>
              <Text type="semibold" size={10} color={theme.colors.white}>
                Keluarkan
              </Text>
            </Button>
          </>
        )
      } else {
        if (item?.materialType == 'Pupuk') {
          return (
            <>
              <MenuButton />
            </>
          )
        } else {
          return (
            <>
              <Button
                onPress={() => {
                  onAccept()
                }}>
                <Text type="semibold" size={10} color={theme.colors.white}>
                  Keluarkan
                </Text>
              </Button>
            </>
          )
        }
      }
    }
    return null
  }

  return (
    <>
      <ModalGeneral
        title={'Blok'}
        description={blockCodes().join(', ') || 'Tidak ada'}
        isOpen={modalBlok}
        onTouchOutside={() => setModalBlok(false)}
      />

      <View style={styles.root}>
        <View style={{flexDirection: 'row', marginHorizontal: 8, alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text size={12} maxLines={2} type="semibold">
              {itemDetail?.requestNumber || item?.requestNumber || '-'}
            </Text>
          </View>

          {isAllowedToOrganize ? shouldShowButtons() : null}
        </View>

        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconFork width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={10}>
                Permintaan
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {item?.name || '-'}
              </Text>
            </View>
          </View>
          <View style={[styles.itemWrapper]}>
            <View style={styles.smallIconView}>
              <IconCalendar width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text maxLines={2} style={styles.itemTitle} size={10}>
                Tanggal
              </Text>
              <Text color={theme.colors.textThinBlack} size={11}>
                {moment(item?.date).format('DD MMM YYYY') || '-'}
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
              <Text style={styles.itemTitle} size={10}>
                Organisasi
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {parent?.organization?.label || '-'}
              </Text>
            </View>
          </View>
          <View style={[styles.itemWrapper]}>
            <View style={styles.smallIconView}>
              <IconOrganizarion width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={10}>
                Divisi
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {parent?.division?.label || '-'}
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
              <Text style={styles.itemTitle} size={10}>
                Blok
              </Text>

              {blockCodes()?.length == 0 ? (
                <Text size={11}>-</Text>
              ) : (
                <ArrayTextWithMoreButton
                  onMorePress={() => {
                    setModalBlok(true)
                  }}
                  textSize={11}
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
              <Text style={styles.itemTitle} size={10}>
                {item?.requestType == 'Uang Tunai' ? 'Jumlah' : 'Kuantitas'}
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {item?.requestType == 'Uang Tunai' ? 'Rp' + numberWithDot(item?.qty) : item?.qty}
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
              <Text style={styles.itemTitle} size={10}>
                Tipe Permintaan
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {item?.requestType || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconSubActivity width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={10}>
                Sub Aktivitas
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {itemDetail?.subActivity?.name || '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconPerson width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={10}>
                Pengaju
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {item?.user?.name || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconClock width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={10}>
                Status
              </Text>
              <Text maxLines={2} color={theme.colors.textThinBlack} size={11}>
                {item?.status == 'Menunggu Persetujuan' ? 'Menunggu dikeluarkan' : item?.status || '-'}
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
              <Text style={styles.itemTitle} size={10}>
                Tujuan Permintaan
              </Text>

              <Text maxLines={2} onTextLayout={onTextLayout} color={theme.colors.textThinBlack} size={11}>
                {itemDetail?.request?.purpose || '-'}
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
        {item?.status == 'Dikeluarkan' ? (
          <View style={styles.container}>
            <View style={styles.itemWrapper}>
              <View style={styles.smallIconView}>
                <IconRequestReason width={ICON_SIZE} height={ICON_SIZE} />
              </View>
              <View style={[styles.leftSpacer, {flex: 1}]}>
                <Text style={styles.itemTitle} size={10}>
                  Nota Pengeluaran Barang
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onDownload()
                  }}>
                  <Text color={theme.colors.blue} size={11} type="semibold" style={{textDecorationLine: 'underline'}}>
                    Unduh NPB
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.itemWrapper}>
              <View style={styles.smallIconView}>
                <IconRequestReason width={ICON_SIZE} height={ICON_SIZE} />
              </View>
              <View style={[styles.leftSpacer, {flex: 1}]}>
                <Text style={styles.itemTitle} size={11}>
                  Nota Pengeluaran Barang
                </Text>

                <TouchableOpacity onPress={() => {}}>
                  <Text size={11} type="semibold">
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  )
}

export default WarehouseManagementDetailInfo

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
