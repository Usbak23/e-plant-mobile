import {theme} from '@app/presentations/utils/styles'
import {Button, Text} from '@app/presentations/_shared-components'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import {RFValue as fs} from 'react-native-responsive-fontsize'

import IconCode from '@assets/icons/ic_small_building.svg'
import IconOrganization from '@assets/icons/ic_small_organization.svg'
import IconPOS from '@assets/icons/ic_small_point_of_sale.svg'
import IconColumnTriple from '@assets/icons/ic_small_column_triple.svg'
import IconMonetize from '@assets/icons/ic_small_monetization.svg'
import IconLocation from '@assets/icons/ic_small_location.svg'
import IconStick from '@assets/icons/ic_stick.svg'
import {useNavigation} from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import {IRawMaterialDetail} from '@app/models/eplant/RawMaterial'
import numberWithDot from '@app/presentations/utils/numberWithDot'

interface IRawMaterialDetailInfoProps {
  isAllowedToOrganizePurchasement?: boolean
  rawMaterial?: IRawMaterialDetail | undefined | null
}

const RawMaterialDetailInfo: React.FC<IRawMaterialDetailInfoProps> = props => {
  const navigation: any = useNavigation()

  const goToAddStock = () => {
    if (props?.rawMaterial?.id) {
      navigation.navigate(Routes.RAW_MATERIAL_PURCHASEMENT_FORM, {rawMaterial: props.rawMaterial})
    }
  }

  const calculateUnitPrice = () => {
    if (!props?.rawMaterial?.totalStock) {
      return 'Rp. -'
    }

    if (props?.rawMaterial?.rawMaterialHistories && Array.isArray(props?.rawMaterial?.rawMaterialHistories)) {
      const totalPurchasePrice = props?.rawMaterial?.rawMaterialHistories.reduce((prev, curr) => prev + curr.price, 0)
      const totalStock = props?.rawMaterial?.totalStock
      const result = parseInt((totalPurchasePrice / totalStock).toString())
      if (isNaN(result)) {
        return 'Rp. -'
      }
      return 'Rp.' + numberWithDot(result) || 'Rp.-'
    }
  }
  return (
    <View style={styles.root}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text type="bold" maxLines={2} color={theme.colors.textThinBlack} size={14}>
            {props.rawMaterial?.name} - [{props.rawMaterial?.code}]
          </Text>
        </View>

        {props.isAllowedToOrganizePurchasement && (
          <Button style={styles.addBlockButton} onPress={() => goToAddStock()}>
            <Text size={fs(10)} style={styles.addBlockButtonText}>
              Tambah stock
            </Text>
          </Button>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconCode width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Kode
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.code || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconOrganization width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Organisasi
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.organization?.name || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPOS width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Kategori Material
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.type || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconColumnTriple width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Total Stok Saat Ini
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.totalStock || '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconPOS width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Satuan
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.uom?.name || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconColumnTriple width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Harga Satuan
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {/* {calculateUnitPrice()} */}
              {props.rawMaterial?.unitPrice ? 'Rp' + numberWithDot(props.rawMaterial?.unitPrice || 0) : 'Rp.-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.itemWrapper}>
          <View style={styles.smallIconView}>
            <IconMonetize width={14} height={14} />
          </View>
          <View style={styles.leftSpacer}>
            <Text style={styles.itemTitle} size={11}>
              Lokasi
            </Text>
            <Text maxLines={1} color={theme.colors.textThinBlack} size={12}>
              {props.rawMaterial?.location || '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RawMaterialDetailInfo

const styles = StyleSheet.create({
  root: {
    margin: 16,
    padding: 24,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  container: {
    marginTop: 16,
    flexDirection: 'row',
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  itemTitle: {
    color: '#9C9C9C',
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
  },
  leftSpacer: {
    flex: 1,
    marginStart: 8,
  },
  smallIconView: {
    backgroundColor: theme.colors.smallIconViewColor,
    padding: 4,
    borderRadius: 5,
  },
  addBlockButton: {
    backgroundColor: theme.colors.black,
  },
  addBlockButtonText: {
    fontSize: 11,
    color: theme.colors.white,
  },
})
