import { User } from '@app/models/eplant/AKP'
import { IOrganizationRowAll } from '@app/models/eplant/Organization'
import { Division } from '@app/models/eplant/RKH'
import Routes from '@app/presentations/navigation/Routes'
import { theme } from '@app/presentations/utils/styles'
import { Text } from '@app/presentations/_shared-components'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MenuTrigger, Menu, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import { useSelector } from 'react-redux'
import { RootState } from '@app/domain/states/reducers'
import { showErrorToast } from '@app/presentations/_shared-components/Toast'
import { Doc, BPBKSSyncStatus } from '@app/models/eplant/BPBKS'

interface Props {
  isAllowedToOrganizeBPBKS?: boolean
  bpbksData?: {
    division: Division
    foreman: User
    organization: IOrganizationRowAll
    date: string
  }
  item: Doc & { isTemp: boolean; syncStatus?: BPBKSSyncStatus; syncError?: string }
  onTap?: (item?: Doc) => void
  onPopupEdit?: (item?: Doc) => void
  onPopupDelete?: (item?: Doc) => void
}

const syncDotColor: Record<BPBKSSyncStatus, string> = {
  pending: '#F5A623',
  syncing: '#4A90E2',
  synced: 'transparent',
  failed: '#D0021B',
}

const SyncDot = ({ status }: { status?: BPBKSSyncStatus }) => {
  if (!status || status === 'synced') return null
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: syncDotColor[status],
        marginLeft: 6,
        alignSelf: 'center',
      }}
    />
  )
}

const BKMCard = ({ bpbksData, ...props }: Props) => {
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
        <View style={{ padding: 10 }}>
          <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
        </View>
      </MenuTrigger>
      {cardOptions()}
    </Menu>
  )

  const cardStyle = () => {
    return isDraft || !props?.item?.absent
      ? {
        backgroundColor: theme.colors.redSemiTransparent,
        shadowColor: theme.colors.pureWhite,
      }
      : {
        backgroundColor: theme.colors.pureWhite,
        shadowColor: theme.colors.black,
      }
  }

  return (
    <TouchableOpacity onPress={() => props?.onTap && props?.onTap(props.item)} style={[styles.card, cardStyle()]}>
      <View>
        {!props?.item?.absent && (
          <Text color={theme.colors.redDark} size={12}>
            Karyawan belum absen
          </Text>
        )}
        {isDraft && (
          <Text color={theme.colors.redDark} size={12}>
            Data disimpan sebagai draft
          </Text>
        )}
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text size={13} color={isDraft ? theme.colors.redDark : theme.colors.accent} type="semibold">
              {props?.item?.harvester?.name} - {props?.item?.harvester?.nip} - {props?.item?.harvester?.role?.name}
            </Text>
            <SyncDot status={props.item?.syncStatus} />
          </View>
          {props.isAllowedToOrganizeBPBKS && <MenuButton />}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Blok
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.tph?.block?.code}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              Tahun Tanam
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.plantingYear || '-'}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              TPH
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.tph?.name}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text color={theme.colors.label} size={11}>
              No. Potong
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.cutNumber != undefined ? props.item?.cutNumber : '-'}
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
    marginHorizontal: 18,
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
