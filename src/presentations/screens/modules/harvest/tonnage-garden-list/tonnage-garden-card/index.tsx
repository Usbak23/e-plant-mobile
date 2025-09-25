import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {ITonnageGardenRow} from '@app/models/eplant/TonnageGarden'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import moment from 'moment'

interface Props {
  isAllowedToOrganizeTonnageGarden?: boolean
  item: ITonnageGardenRow
  onTap?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const TonnageGardenCard: React.FC<Props> = ({
  onEdit,
  onDelete,
  onTap,
  item,
  isAllowedToOrganizeTonnageGarden,
}: Props) => {
  const CardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 8,
          borderRadius: 10,
        },
      }}>
      <MenuOption onSelect={onEdit}>
        <PopupEditDelete iconName="create" text="Ubah" />
      </MenuOption>
      <MenuOption value={1} onSelect={onDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        onTap && onTap()
      }}>
      <View>
        <View>
          <View>
            <View style={styles.header}>
              <View style={{flex: 1}}>
                <Text color={theme.colors.accent} type="semibold">
                  {item?.poNumber || '-'}
                </Text>
              </View>

              <View>
                {isAllowedToOrganizeTonnageGarden && (
                  <Menu>
                    <MenuTrigger>
                      <View style={{padding: 10}}>
                        <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                      </View>
                    </MenuTrigger>
                    {CardOptions()}
                  </Menu>
                )}
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 16}}>
            <View style={{flex: 1}}>
              <Text size={12} color={theme.colors.grey}>
                Tanggal
              </Text>
              <Text color={theme.colors.textThinBlack}>{moment(item?.date).format('DD MMMM YYYY')}</Text>

              <View style={{flex: 1, marginTop: 16}}>
                <Text size={12} color={theme.colors.grey}>
                  Kendaraan
                </Text>
                <Text color={theme.colors.textThinBlack}>{`${item?.item?.name || ''} - ${
                  item?.item?.serialNumber || ''
                }`}</Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text size={12} color={theme.colors.grey}>
                Supir
              </Text>
              <Text color={theme.colors.textThinBlack}>{item?.driver || '-'}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TonnageGardenCard

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 22,
    marginVertical: 7.5,
    backgroundColor: theme.colors.pureWhite,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
