import React from 'react'
import { IOrganizationRowAll } from '@app/models/eplant/Organization'
import { Division } from '@app/models/eplant/Division'
import { IUserRow } from '@app/models/eplant/User'
import { theme } from '@app/presentations/utils/styles'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '@app/presentations/_shared-components'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import { IPMA, IPMAEmployee } from '@app/models/eplant/PMA'

interface Props {
  isAllowedToOrganizePMA?: boolean
  isDraft?: boolean
  pmaFilterData?: {
    organization: IOrganizationRowAll
    division: Division
    foreman: IUserRow
    datePMA: string
  }
  foremanName?: string
  item: IPMAEmployee
  onEdit: () => void
  onTap: () => void
  onDelete: () => void
}

const PMACard = ({
  isDraft,
  pmaFilterData,
  item,
  foremanName,
  onEdit,
  onTap,
  onDelete,
  isAllowedToOrganizePMA,
}: Props) => {
  const navigation: any = useNavigation()
  const cardStyle = () => {
    return isDraft
      ? {
        backgroundColor: theme.colors.redSemiTransparent,
        shadowColor: theme.colors.pureWhite,
      }
      : {
        backgroundColor: theme.colors.pureWhite,
        shadowColor: theme.colors.black,
      }
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
    <TouchableOpacity style={[styles.card, cardStyle()]} onPress={onTap}>
      <View>
        <View>
          {isDraft && (
            <Text color={theme.colors.redDark} size={12}>
              Data disimpan sebagai draft
            </Text>
          )}

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text color={theme.colors.accent} type="semibold">
                {foremanName || '-'}
              </Text>
            </View>

            <View>
              {isAllowedToOrganizePMA && (
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
          </View>
        </View>


        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text size={12} color={theme.colors.grey}>
              Blok
            </Text>
            <Text color={theme.colors.textThinBlack}>{item?.block?.code || '-'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text size={12} color={theme.colors.grey}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack}>{item?.plantingYear || '-'}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  )
}

export default PMACard

const styles = StyleSheet.create({
  card: {
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
  attendanceButton: {
    backgroundColor: 'rgba(240, 177, 13, 0.15);',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },

  attendanceButtonRed: {
    backgroundColor: theme.colors.redSemiTransparent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignContent: 'center',
  },

  header: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
