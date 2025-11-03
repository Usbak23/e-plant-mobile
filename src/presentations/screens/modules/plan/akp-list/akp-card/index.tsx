import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Text from '@components/Text'
import {theme} from '@app/presentations/utils/styles'
import Entypo from 'react-native-vector-icons/Entypo'
import {IAKPRow} from '@models/eplant/AKP'
import {MenuOptions, MenuOption} from 'react-native-popup-menu'
import PopupEditDelete from '@components/PopupEditDelete'
import {MenuTrigger, Menu} from 'react-native-popup-menu'
import Routes from '@app/presentations/navigation/Routes'
import {useNavigation} from '@react-navigation/core'
import moment from 'moment'
import {showErrorToast} from '@components/Toast'
import {useSelector} from 'react-redux'
import {RootState} from '@app/domain/states/reducers'

interface Props {
  ORGANIZATION?: {label: string; value: string}
  DIVISION?: {label: string; value: string}
  DATE?: string
  isAllowedToOrganizeAKP?: boolean
  item: IAKPRow
  onDelete: (item: IAKPRow) => void
}
export default function Card({item, onDelete, isAllowedToOrganizeAKP, ORGANIZATION, DIVISION, DATE}: Props) {
  const navigation: any = useNavigation()

  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const handleDelete = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat menghapus data dalam mode offline')
      return
    }
    onDelete(item)
  }

  const handelEdit = () => {
    if (!item?.isTemp && !isConnected) {
      showErrorToast('Anda tidak dapat merubah data dalam mode offline')
      return
    }

    const obj = {
      parent: {
        ORGANIZATION: {...ORGANIZATION},
        DIVISION: {...DIVISION},
        DATE,
      },
    }
    navigation.navigate(Routes.AKP_FORM, {item, ...obj})
  }

  const total = item?.akpLines.reduce(
    (prev, curr) => ({
      bunches: parseInt(curr.totalBunches) + prev.bunches,
      tree: parseInt(curr.totalTree) + prev.tree,
    }),
    {
      bunches: 0,
      tree: 0,
    },
  )

  const akpPercent = (100 * total.bunches) / total.tree

  const cardOptions = () => (
    <MenuOptions
      customStyles={{
        optionsContainer: {
          padding: 10,
          borderRadius: 10,
        },
      }}>
      <MenuOption value={0} onSelect={handelEdit}>
        <PopupEditDelete iconName="create" text="Edit" />
      </MenuOption>
      <MenuOption value={1} onSelect={handleDelete}>
        <PopupEditDelete iconName="delete" text="Hapus" />
      </MenuOption>
    </MenuOptions>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.card, item?.isTemp && {backgroundColor: 'rgba(233, 86, 117, 0.15)', shadowColor: '#fff'}]}
      onPress={() => {
        const obj = {
          parent: {
            ORGANIZATION: {...ORGANIZATION},
            DIVISION: {...DIVISION},
            DATE,
          },
        }
        navigation.navigate(Routes.AKP_DETAIL, {item, ...obj})
      }}>
      {item?.isTemp && (
        <Text color={'#E95675'} size={8} type="semibold">
          Anda dalam mode offline. AKP dijadikan sebagai draft.
        </Text>
      )}
      <View style={styles.header}>
        <Text color={theme.colors.accent} style={{marginTop: 10}} type="semibold">
          {item?.numberAkp || `${item?.block?.code} - ${moment(item?.harvestDate).format('DDMMYY')}` || '-'}
        </Text>
        {isAllowedToOrganizeAKP && (
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
            % AKP
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.akpPercent ? item?.akpPercent?.toFixed(2) + '%' : akpPercent?.toFixed(2) + '%' || '-'}
          </Text>
        </View>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total Tandan (Survey)
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalBunches || total.bunches || '-'}
          </Text>
        </View>
      </View>
      <View style={styles.wrapInfo}>
        <View style={styles.wrapLabelValue}>
          <Text color={theme.colors.label} size={11}>
            Total Pokok (Survey)
          </Text>
          <Text color={theme.colors.textThinBlack} size={12}>
            {item?.totalTree || total.tree || '-'}
          </Text>
        </View>
        <View style={[styles.wrapLabelValue, item?.isStandard ? styles.standardView : styles.standardViewRed]}>
          <Text color={item?.isStandard ? '#00B098' : theme.colors.redDark} size={12}>
            {item?.isStandard ? 'Sesuai standar' : 'Tidak sesuai standar'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  standardViewRed: {
    padding: 4,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.redSemiTransparent,
  },
  standardView: {
    padding: 4,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 176, 152, 0.15)',
  },
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
})
