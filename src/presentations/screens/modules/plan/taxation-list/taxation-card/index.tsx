import React from 'react'
import {ITaxationRow} from '@app/models/eplant/Taxation'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'
import {theme} from '@app/presentations/utils/styles'
import {Text} from '@app/presentations/_shared-components'
import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'

interface ITaxationCardProps {
  isAllowedToOrganizeTaxation?: boolean
  item: ITaxationRow
  onTap?: (item?: any) => void
  onPopupEdit?: (item?: any) => void
  onPopupDelete?: (item?: any) => void
  onCompleteTaxation?: (item?: any) => void
}

const TaxationCard: React.FC<ITaxationCardProps> = props => {
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

  const onReceive = () => props.onCompleteTaxation && props.onCompleteTaxation(props.item)

  const ReceiveButton = () => (
    <TouchableOpacity onPress={onReceive}>
      <View style={styles.receiveButton}>
        <Text color="#F0B10D" type="semibold" size={11}>
          Lengkapi Taksasi
        </Text>
      </View>
    </TouchableOpacity>
  )

  const CardOptions = () => (
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
    <View style={[!props?.item?.isValidTaxation ? styles.cardRed : styles.card]}>
      <TouchableOpacity onPress={onTap}>
        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            {!props?.item?.isValidTaxation && (
              <View style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center'}}>
                <Feather name="info" size={18} color={theme.colors.redDark} />
                <Text style={{marginHorizontal: 8}} size={11} type="semibold" color={theme.colors.redDark}>
                  Taksasi tidak valid karena belum dilengkapi dan periode telah ditutup. Anda dapat menghapus Taksasi
                  melalui AKP di tanggal {props?.item?.harvestDate}
                </Text>
              </View>
            )}

            <Text color={props?.item?.isValidTaxation ? theme.colors.accent : theme.colors.redDark} type="semibold">
              {props.item?.taxation ? props.item?.taxation?.numberTaxation : props.item?.numberAkp}
            </Text>
          </View>

          {props?.item?.isValidTaxation
            ? props.item?.isHaveTaksasi
              ? props.isAllowedToOrganizeTaxation &&
                Boolean(props.item?.taxation?.status == 'open') && (
                  <Menu>
                    <MenuTrigger>
                      <View style={{padding: 10}}>
                        <Entypo name="dots-three-vertical" size={15} color={theme.colors.textThinBlack} />
                      </View>
                    </MenuTrigger>
                    {CardOptions()}
                  </Menu>
                )
              : props.isAllowedToOrganizeTaxation &&
                Boolean(props.item?.isAvaliableCreateTaxation) &&
                Boolean(props.item?.taxation == null) && <ReceiveButton />
            : null}

          {/* {} */}
        </View>

        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              % AKP
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.akpPercent ? props.item?.akpPercent + '%' : '-'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Janjang Masak
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.taxation?.ripeFruit ? props.item?.taxation?.ripeFruit.toFixed(2) : '-'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              BJR
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.taxation?.bjr || '-'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Kilogram
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.taxation?.kilogram ? props.item?.taxation?.kilogram.toFixed(2) : '-'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Total Ha
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.taxation?.totalHectares ? props.item?.taxation?.totalHectares.toFixed(2) : '-'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text color={theme.colors.label} size={11}>
              Pembuat Taksasi
            </Text>
            <Text color={theme.colors.textThinBlack} size={12}>
              {props.item?.taxation?.user?.name
                ? `${props?.item?.taxation?.user?.name || ''} - ${props?.item?.taxation?.user?.nip || ''} - ${
                    props?.item?.taxation?.user?.role?.name || ''
                  }`
                : '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default TaxationCard

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
  cardRed: {
    backgroundColor: theme.colors.semiRed,
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
