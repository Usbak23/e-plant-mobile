import {IItemRow} from '@app/models/eplant/Item'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import IconCategory from '@assets/icons/ic_small_organization.svg'
import IconMoreHoriz from '@assets/icons/ic_more-horizontal.svg'
import IconOrganization from '@assets/icons/ic_small_building.svg'
import IconModel from '@assets/icons/ic_block.svg'
import IconCalendar from '@assets/icons/ic_small_calendar.svg'
import IconPerson from '@assets/icons/ic_small_people.svg'
import Entypo from 'react-native-vector-icons/Entypo'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import { useIsAllowedToOrganizeToolsAndItems } from '@app/domain/states/user/hooks'

interface IProps {
  i?: IItemRow
  onDelete?: Function
}

const ItemDetailTransportationInfo = ({i, onDelete = () => {}}: IProps) => {
  const navigation: any = useNavigation()
  const isAllowedToOrganizeItem = useIsAllowedToOrganizeToolsAndItems()

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption
        value={0}
        onSelect={() => {
          navigation.navigate(Routes.ITEM_FORM, {item: i})
        }}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={() => onDelete()}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )
  return (
    <View style={styles.root}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text type="bold" maxLines={2} color={theme.colors.textThinBlack} size={14}>
            {`${i?.name || ''} - ${i?.serialNumber || ''} - ${i?.organization?.name || ''}` || '-'}
          </Text>
        </View>

        {
          isAllowedToOrganizeItem && (        <Menu>
            <MenuTrigger customStyles={{triggerTouchable: styles.menu}}>
              <View style={{padding: 10}}>
                <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
              </View>
            </MenuTrigger>
            {cardOptions()}
          </Menu>)
        }


      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCategory width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Item Kategori
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {i?.itemMaster?.categoryItem?.name || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconMoreHoriz width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Master Item
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {i?.itemMaster?.name || '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconOrganization width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {i?.organization?.name || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconModel width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Model
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {i?.model || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCalendar width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Tahun Pembelian
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {i?.yearOfPurchase || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPerson width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Penanggung Jawab
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {i?.personResponsible?.name || '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ItemDetailTransportationInfo

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 24,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {
    marginTop: 16,
    flexDirection: 'row',
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  menu: {padding: 13, margin: -13},
  itemTitle: {
    color: '#9C9C9C',
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftSpacer: {
    flex: 1,
    marginStart: 8,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
  addBlockButton: {
    backgroundColor: theme.colors.black,
  },
  addBlockButtonText: {
    fontSize: 11,
    color: theme.colors.white,
  },
})
