import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import {MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import {MenuTrigger, Menu} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation} from '@react-navigation/core'
import {ITPHRow} from '@app/models/eplant/TPH'
import {baseProps} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers'
import {isGeoJSONExist} from '@app/presentations/utils/validation/geojson-validation'

interface Props {
  isAllowedToOrganizeTPH?: boolean
  module?: boolean
  item: ITPHRow
  onDelete: (item: ITPHRow) => void
}
export default function Card({item, onDelete, module, isAllowedToOrganizeTPH}: Props) {
  const navigation: any = useNavigation()

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
          let obj
          if (module) {
            obj = {item: item, module: module}
          } else {
            obj = {item: item}
          }
          navigation.navigate(Routes.TPH_FORM, {...obj})
        }}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption
        value={1}
        onSelect={() => {
          onDelete(item)
        }}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text color={theme.colors.accent} type="semibold">
          {item?.name || '-'}
        </Text>
        {isAllowedToOrganizeTPH && (
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
        <TouchableOpacity
          style={styles.wrapLabelValue}
          disabled={!isGeoJSONExist(item?.geoJson)}
          onPress={() => {
            if (isGeoJSONExist(item?.geoJson)) {
              navigation.navigate(Routes.MAPS_PREVIEW, {geoJSON: item?.geoJson})
            }
          }}>
          <Text color={theme.colors.label} size={11}>
            Koordinat
          </Text>
          <Text color={theme.colors.blue} type="semibold" size={12}>
            {item?.fileGeoJson || 'Tidak tersedia'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
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
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
})
