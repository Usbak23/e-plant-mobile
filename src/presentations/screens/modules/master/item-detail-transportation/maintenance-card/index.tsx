import {IDailyActivity} from '@app/models/eplant/IDailyActivity'
import {IItemRow} from '@app/models/eplant/Item'
import {IMaintenance} from '@app/models/eplant/Maintenance'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IProps {
  maintenance?: IMaintenance
  onDelete?: Function
  item?: IItemRow
  userInfo?: any
  isAllowedToOrganize?: boolean
}

const ItemMaintenanceCard = ({
  maintenance,
  item,
  onDelete = () => {},
  userInfo,
  isAllowedToOrganize = false,
}: IProps) => {
  const navigation = useNavigation()

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      {isAllowedToOrganize && (
        <>
          <MenuOption
            value={0}
            onSelect={() => {
              //@ts-ignore
              navigation.navigate(Routes.MAINTENANCE_FORM, {item, maintenance})
            }}>
            <PopupEditDelete iconName="create" text="Ubah Maintenance" />
          </MenuOption>
          <MenuOption value={1} onSelect={() => onDelete(maintenance)}>
            <PopupEditDelete iconName="delete" text="Hapus Maintenance" />
          </MenuOption>
        </>
      )}

      <MenuOption
        value={2}
        onSelect={() => {
          //@ts-ignore
          navigation.navigate(Routes.MAINTENANCE_DETAIL, {item, maintenance})
        }}>
        <PopupEditDelete iconName="remove-red-eye" text="Lihat Maintenance" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.card}
      onPress={() => {
        //@ts-ignore
        navigation.navigate(Routes.MAINTENANCE_DETAIL, {item, maintenance})
      }}>
      <View style={styles.header}>
        <Text color={theme.colors.accent} type="semibold">
          {maintenance?.date ? moment(maintenance?.date).format('DD MMMM YYYY') : '-'}
        </Text>
        {userInfo?.id == maintenance?.user?.id && (
          <Menu>
            <MenuTrigger customStyles={{triggerTouchable: styles.menu}}>
              <View style={{padding: 10}}>
                <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
              </View>
            </MenuTrigger>
            {cardOptions()}
          </Menu>
        )}
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Kode Kegiatan
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {maintenance?.subActivity?.accountNumber || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Waktu
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {maintenance?.time || '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Nama Kegiatan
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {maintenance?.subActivity?.name || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Karyawan
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {maintenance?.user?.name || '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ItemMaintenanceCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
})
