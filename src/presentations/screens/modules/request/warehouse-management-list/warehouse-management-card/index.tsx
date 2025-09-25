import {IManagementWarehouse} from '@app/models/eplant/WarehouseManagement'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import moment from 'moment'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import {number} from 'yup'

interface IProps {
  onTap?: Function
  onIssued?: Function
  onAddUntilan?: Function
  item?: IManagementWarehouse
  isAllowedToOrganize?: boolean
}

const WarehouseManagementCard = ({item, onTap = () => {}, onIssued = () => {}, onAddUntilan = () => {}, isAllowedToOrganize = false}: IProps) => {
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
          onIssued()
        }}>
        <PopupEditDelete iconName="call-made" text="Keluarkan" />
      </MenuOption>
      {item?.materialType == 'Pupuk' && (
        <MenuOption
          value={1}
          onSelect={() => {
            onAddUntilan()
          }}>
          <PopupEditDelete
            iconName="add"
            text={item?.bpus && Array.isArray(item?.bpus) && item?.bpus?.length > 0 ? 'Ubah Untilan' : 'Tambah Untilan'}
          />
        </MenuOption>
      )}
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
    <TouchableOpacity onPress={() => onTap()} style={styles.card}>
      <View style={styles.containerTitle}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {item?.requestNumber || '-'}
          </Text>
        </View>
        {
          isAllowedToOrganize ? item?.status == 'Menunggu Persetujuan' && <MenuButton /> : null
        }
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Tanggal
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {moment(item?.date).format('DD MMMM YYYY') || '-'}
          </Text>
        </View>
        {item?.requestType == 'Uang Tunai' ? (
          <View style={{flex: 1, marginRight: 4}}>
            <Text color={theme.colors.label} size={11}>
              Jumlah
            </Text>
            <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
              {'Rp' + numberWithDot(item?.qty)}
            </Text>
          </View>
        ) : (
          <View style={{flex: 1, marginRight: 4}}>
            <Text color={theme.colors.label} size={11}>
              Permintaan
            </Text>
            <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
              {item?.name || '-'}
            </Text>
          </View>
        )}
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Tipe Permintaan
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.requestType || '-'}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Pengaju
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.user?.name || '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default WarehouseManagementCard

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
