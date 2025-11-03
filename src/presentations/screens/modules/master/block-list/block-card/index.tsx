import { IBlockRow } from '@app/models/eplant/Block'
import Routes from '@app/presentations/navigation/Routes'
import { theme } from '@app/presentations/utils/styles'
import { isGeoJSONExist } from '@app/presentations/utils/validation/geojson-validation'
import { Text } from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'

interface IBlockCardProps {
  isAllowedToOrganizeBlock?: boolean
  item?: IBlockRow
  onTap?: (item?: IBlockRow) => void
  onPopupEdit?: (item?: IBlockRow) => void
  onPopupDelete?: (item?: IBlockRow) => void
}

const BlockCard: React.FC<IBlockCardProps> = props => {
  const navigation: any = useNavigation()
  const onCardTap = () => {
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
    <View style={styles.card}>
      <TouchableOpacity onPress={onCardTap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.accent} type="semibold">
              {props.item?.code || ''} - {props?.item?.division?.name || ''} -{' '}
              {props.item?.division?.organization?.name || ''}
            </Text>
          </View>

          {props.isAllowedToOrganizeBlock && (
            <Menu>
              <MenuTrigger>
                <View style={{ padding: 10 }}>
                  <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                </View>
              </MenuTrigger>
              {cardOptions()}
            </Menu>
          )}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ width: '40%', marginEnd: 8 }}>
            <TouchableOpacity
              disabled={!isGeoJSONExist(props.item?.geoJson)}
              onPress={() => {
                if (isGeoJSONExist(props.item?.geoJson)) {
                  navigation.navigate(Routes.MAPS_PREVIEW, { geoJSON: props.item?.geoJson })
                }
              }}>
              <View>
                <Text color={theme.colors.label} size={11}>
                  Koordinat
                </Text>
                <Text color={theme.colors.blue} type="semibold" size={12}>
                  {props.item?.fileGeoJson || 'Tidak tersedia'}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.topSpacer}>
              <Text color={theme.colors.label} size={11}>
                Tahun Tanam
              </Text>
              <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
                {props.item?.plantingYear ? props?.item?.plantingYear?.join(', ') : '-'}
              </Text>
            </View>
          </View>

          <View style={{ marginEnd: 8, width: '30%' }}>
            <View>
              <Text color={theme.colors.label} size={11}>
                Jumlah TPH
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {props.item?.tphs}
              </Text>
            </View>

            <View style={[styles.topSpacer]}>
              <Text color={theme.colors.label} size={11}>
                Jumlah Pokok
              </Text>
              <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
                {props.item?.totalTreeEachYear ? props.item?.totalTreeEachYear?.join(', ') : '-'}
              </Text>
            </View>



          </View>


        </View>


        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ width: '40%', marginEnd: 8 }}>
            <View>
              <Text color={theme.colors.label} size={11}>
                Luas Blok
              </Text>

              <View>
                <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
                  {props?.item?.blockArea + ' Ha'}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginEnd: 8, width: '30%' }}>
            <View>
              <Text color={theme.colors.label} size={11}>
                SPH
              </Text>
              <Text color={theme.colors.textThinBlack} size={12}>
                {props.item?.sph || '-'}
              </Text>
            </View>

          </View>
        </View>

      </TouchableOpacity>
    </View>
  )
}

export default BlockCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
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

  topSpacer: {
    marginTop: 16,
  },
})
