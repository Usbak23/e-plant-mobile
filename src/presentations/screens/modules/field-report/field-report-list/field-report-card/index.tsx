import {IFieldReport} from '@app/models/eplant/FieldReport'
import {IMyRequest} from '@app/models/eplant/Request'
import {ICurrentUser} from '@app/models/eplant/User'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import moment from 'moment'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IProps {
  item?: IFieldReport
  onTap?: Function
  onPopupDelete?: Function
  onPopupEdit?: Function
  user?: ICurrentUser
  isAllowedToOrganize?: boolean
}

const ListFieldReportCard = ({
  onPopupDelete = () => {},
  onPopupEdit = () => {},
  item,
  onTap = () => {},
  user,
  isAllowedToOrganize = false,
}: IProps) => {
  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      {user?.id == item?.user?.id && isAllowedToOrganize && (
        <>
          <MenuOption onSelect={() => onPopupEdit()}>
            <PopupEditDelete iconName="create" text="Ubah Berita Acara" />
          </MenuOption>
          <MenuOption value={1} onSelect={() => onPopupDelete()}>
            <PopupEditDelete iconName="delete" text="Hapus Berita Acara" />
          </MenuOption>
        </>
      )}

      <MenuOption value={1} onSelect={() => onTap()}>
        <PopupEditDelete iconName="remove-red-eye" text="Lihat Berita Acara" />
      </MenuOption>
    </MenuOptions>
  )
  return (
    <TouchableOpacity onPress={() => onTap()} style={styles.card}>
      <View style={styles.containerTitle}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {item?.reportNumber || '-'}
          </Text>
        </View>
        <Menu>
          <MenuTrigger>
            <View style={{padding: 10}}>
              <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
            </View>
          </MenuTrigger>
          {cardOptions()}
        </Menu>
      </View>
      <View style={{flexDirection: 'row', marginTop: 16}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Tanggal
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {moment(item?.date).format('DD MMMM YYYY') || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Blok
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.block?.code || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Sub Aktivitas
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.subActivity?.name || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Karyawan
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.user?.name || '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListFieldReportCard

const styles = StyleSheet.create({
  containerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: 'white',
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
})
