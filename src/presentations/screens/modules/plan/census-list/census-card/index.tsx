import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {ICensusRow} from '@app/models/eplant/Census'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'

interface ICensusCardProps {
  isAllowedToOrganizeCensus?: boolean
  item: ICensusRow
  onTap?: (item?: any) => void
  onPopupEdit?: (item?: any) => void
  onPopupDelete?: (item?: any) => void
}

const CensusCard: React.FC<ICensusCardProps> = props => {
  const onTap = () => {
    if (props.onTap) {
      props.onTap(props.item)
    }
  }

  const onEdit = () => {
    props.onPopupEdit && props.onPopupEdit(props.item)
  }

  const onDelete = () => {
    props.onPopupDelete && props.onPopupDelete(props.item)
  }

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption onSelect={onEdit}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={onDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <View style={[styles.card]}>
      <TouchableOpacity onPress={onTap}>
        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text color={theme.colors.accent} type="semibold">
            {props?.item?.numberCensus}
          </Text>
          {props.isAllowedToOrganizeCensus && (
            <Menu>
              <MenuTrigger>
                <View style={{padding: 10}}>
                  <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                </View>
              </MenuTrigger>
              {cardOptions()}
            </Menu>
          )}
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Tanggal
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {dateFormatter(props.item?.dateCensus)}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Organisasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.block?.division?.organization?.name || '-'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Divisi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.block?.division?.name || '-'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Total Tonase
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.totalTonnage}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Ton/Ha
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.tonnagePerHectare ? props.item?.tonnagePerHectare.toFixed(2) : '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default CensusCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 22,
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
  receiveButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },
})
