import {User} from '@app/models/eplant/AKP'
import {IOrganizationRowAll} from '@app/models/eplant/Organization'
import {Division} from '@app/models/eplant/RKH'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {MenuTrigger, Menu, MenuOptions, MenuOption} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {useSelector} from 'react-redux'
import {RootState} from '@app/domain/states/reducers'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'
import {BkmEmployee2} from '@app/models/eplant/BKM'

interface Props {
  isAllowedToOrganizeBKMTakeCare?: boolean
  bkmData?: {
    division: Division
    foreman: User
    organization: IOrganizationRowAll
    date: string
  }
  // item: BkmEmployee2 & {isTemp: boolean}
  item: any
  onTap?: (item?: BkmEmployee2) => void
  onPopupEdit?: (item?: BkmEmployee2) => void
  onPopupDelete?: (item?: BkmEmployee2) => void
  __subAct?: any
}

const BKMCard = ({bkmData, ...props}: Props) => {
  const navigation: any = useNavigation()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const isDraft = props.item?.isTemp
  const onEdit = () => {
    if (!isDraft && !isConnected) {
      showErrorToast('Anda tidak dapat edit data dalam mode offline')
      return
    }
    props.onPopupEdit && props.onPopupEdit(props.item)
  }

  const onDelete = () => {
    if (!isDraft && !isConnected) {
      showErrorToast('Anda tidak dapat menghapus data dalam mode offline')
      return
    }
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

  const cardStyle = () => {
    return isDraft || isDonotTakeAttendace || isBkmEmpty
      ? {
          backgroundColor: theme.colors.redSemiTransparent,
          shadowColor: theme.colors.pureWhite,
        }
      : {
          backgroundColor: theme.colors.pureWhite,
          shadowColor: theme.colors.black,
        }
  }

  const isDonotTakeAttendace = props?.item?.employee_do_not_take_attendance
  const isBkmEmpty = props?.item?.empty_bkm

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(Routes.BKM_TAKE_CARE_EMPLOYEE_DETAIL, {item: props.item, bkmData, subAct: props.__subAct})
      }
      style={[styles.card, cardStyle()]}>
      <View>
        {isDraft && (
          <Text color={theme.colors.redDark} size={12}>
            Data disimpan sebagai draft
          </Text>
        )}
        {isDonotTakeAttendace && (
          <Text color={theme.colors.redDark} size={12}>
            Karyawan tidak melakukan absensi
          </Text>
        )}

        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text
              color={isDraft || isBkmEmpty || isDonotTakeAttendace ? theme.colors.redDark : theme.colors.accent}
              type="semibold">
              {props?.item?.user?.nip} - {props?.item?.user?.name}
            </Text>
          </View>

          {props.isAllowedToOrganizeBKMTakeCare && <MenuButton />}
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 4}}>
            <Text color={theme.colors.label} size={11}>
              Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.block?.code}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Status Kerja
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.workStatus?.name || '-'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default BKMCard

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
