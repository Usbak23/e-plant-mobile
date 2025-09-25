import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React, {useCallback, useState} from 'react'
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
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import Entypo from 'react-native-vector-icons/Entypo'
import {IFieldReport, IFieldReportDetail} from '@app/models/eplant/FieldReport'

const ICON_SIZE = 17

interface IProps {
  onEdit?: Function
  onDelete?: Function
  item?: IFieldReport
  itemDetail?: IFieldReportDetail
  parent?: any
  onMoreTap?: Function
  user?: any
  isAllowedToOrganize?: boolean
}

const FieldReportDetailInfo = ({
  onEdit = () => {},
  item,
  parent,
  itemDetail,
  onDelete = () => {},
  onMoreTap = () => {},
  user,
  isAllowedToOrganize = false,
}: IProps) => {
  const [textLength, setTextLength] = useState(0)
  const onTextLayout = useCallback(e => {
    setTextLength(e.nativeEvent.lines.length)
  }, [])
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption onSelect={() => onEdit()}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={() => onDelete()}>
        <PopupEditDelete iconName="delete" text="Hapus" />
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

  return (
    <>
      <View style={styles.root}>
        <View style={{flexDirection: 'row', marginHorizontal: 8, marginBottom: 16, alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text type="semibold">{item?.reportNumber || '-'}</Text>
          </View>
          {user?.id == item?.user?.id && isAllowedToOrganize && <MenuButton />}
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
                {parent?.organization?.label || '-'}
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
              <Text style={styles.itemTitle} size={11}>
                Blok
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.block?.code || '-'}
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
              <IconQuantity width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Kategori
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.category || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconTypeRequest width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Sub Aktivitas
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {item?.subActivity?.name || '-'}
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
              <Text style={styles.itemTitle} size={11}>
                Karyawan
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.user?.name || item?.user?.name || '-'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.itemWrapper}>
            <View style={styles.smallIconView}>
              <IconSubActivity width={ICON_SIZE} height={ICON_SIZE} />
            </View>
            <View style={[styles.leftSpacer, {flex: 1}]}>
              <Text style={styles.itemTitle} size={11}>
                Subjek
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.subject || item?.subject || '-'}
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
                Deskripsi
              </Text>
              {/* <Text color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.description || item?.description || '-'}
              </Text> */}
              <Text maxLines={2} onTextLayout={onTextLayout} color={theme.colors.textThinBlack} size={12}>
                {itemDetail?.description || '-'}
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
      </View>
    </>
  )
}

export default FieldReportDetailInfo

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
})
