import {IRealizationFertilizationRow} from '@app/models/eplant/RealizationFertilization'
import {theme} from '@app/presentations/utils/styles'
import {ArrayTextWithMoreButton, Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import moment from 'moment'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IProps {
  item?: IRealizationFertilizationRow
  onTap?: Function
  onPopupEdit?: Function
  onPopupDelete?: Function
  onVarietasTap?: Function
}

const RealizationFertilizationCard = ({
  item,
  onTap = () => {},
  onPopupEdit = () => {},
  onPopupDelete = () => {},
  onVarietasTap = () => {},
}: IProps) => {
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
          onPopupEdit && onPopupEdit()
        }}>
        <PopupEditDelete iconName="create" text="Ubah Realisasi" />
      </MenuOption>
      <MenuOption
        value={1}
        onSelect={() => {
          onPopupDelete && onPopupDelete()
        }}>
        <PopupEditDelete iconName="delete" text="Hapus Realisasi" />
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

  const blockVarietas = () => {
    if (Array.isArray(item?.block?.varieties) && item?.block?.varieties && item?.block?.varieties?.length > 0) {
      return item?.block?.varieties.map((variety: any) => {
        return variety || ''
      })
    }
    return []
  }

  return (
    <TouchableOpacity onPress={() => onTap()} style={styles.card}>
      <View style={styles.containerTitle}>
        <View style={{flex: 1}}>
          <Text color={theme.colors.accent} type="semibold">
            {item?.block?.code || '-'}
          </Text>
        </View>
        <MenuButton />
      </View>
      <View style={{flexDirection: 'row', marginTop: 16}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Tanggal Aplikasi
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {moment(item?.date).format('DD MMMM YYYY') || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Tahun Tanam
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.block?.plantingYear?.join(', ') || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Ha
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.block?.blockArea || '-'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text color={theme.colors.label} size={11}>
            Rotasi
          </Text>
          <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
            {item?.rotation || '-'}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flex: 1, marginRight: 4}}>
          <Text color={theme.colors.label} size={11}>
            Varietas
          </Text>
          {!item?.block?.varieties || (Array.isArray(item?.block?.varieties) && item?.block?.varieties?.length == 0) ? (
            <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
              -
            </Text>
          ) : blockVarietas().length > 3 ? (
            <TouchableOpacity
              onPress={() => {
                onVarietasTap && onVarietasTap()
              }}>
              <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
                {blockVarietas().slice(0, 2).join(', ')} dan {blockVarietas().length - 2} Lainnya
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{marginTop: 8}} color={theme.colors.textThinBlack} size={12}>
              {blockVarietas().join(', ')}
            </Text>
          )}
        </View>
        <View style={{flex: 1}} />
      </View>
    </TouchableOpacity>
  )
}

export default RealizationFertilizationCard

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
