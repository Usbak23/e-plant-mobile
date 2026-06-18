import React from 'react'
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Header, Text} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {theme} from '@app/presentations/utils/styles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment'

const SPBLocalDetail = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const {item, divisionId, date, organizationName, divisionName} = route.params || {}

  const kendaraan = item?.gardenTonnage?.item?.name
    ? `${item.gardenTonnage.item.name} - ${item.gardenTonnage.item.serialNumber || ''}`
    : '-'

  const totalJJG = item?.items?.reduce((s: number, i: any) => s + (i.janjang || 0), 0) || 0

  const renderItem = ({item: row}: any) => (
    <View style={styles.row}>
      <View style={styles.rowCell}>
        <Text color={theme.colors.label} size={11}>Blok</Text>
        <Text color={theme.colors.textThinBlack} size={13} type="semibold">
          {row.block?.code || '-'}
        </Text>
      </View>
      <View style={styles.rowCell}>
        <Text color={theme.colors.label} size={11}>Tahun Tanam</Text>
        <Text color={theme.colors.textThinBlack} size={13}>
          {row.plantingYear || '-'}
        </Text>
      </View>
      <View style={styles.rowCell}>
        <Text color={theme.colors.label} size={11}>TPH</Text>
        <Text color={theme.colors.textThinBlack} size={13}>
          {row.tph?.name || row.tph?.code || '-'}
        </Text>
      </View>
      <View style={[styles.rowCell, {alignItems: 'flex-end'}]}>
        <Text color={theme.colors.label} size={11}>JJG</Text>
        <Text color={theme.colors.accent} size={13} type="semibold">
          {row.janjang || 0}
        </Text>
      </View>
    </View>
  )

  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text color={theme.colors.label} size={11}>Tanggal</Text>
        <Text color={theme.colors.textThinBlack} size={13}>{moment(date).format('D MMMM YYYY')}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text color={theme.colors.label} size={11}>Kendaraan</Text>
        <Text color={theme.colors.textThinBlack} size={13}>{kendaraan}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text color={theme.colors.label} size={11}>Total JJG</Text>
        <Text color={theme.colors.accent} size={14} type="semibold">{totalJJG}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text size={11} color="white" style={{flex: 1}}>Blok</Text>
        <Text size={11} color="white" style={{flex: 1}}>Thn Tanam</Text>
        <Text size={11} color="white" style={{flex: 1}}>TPH</Text>
        <Text size={11} color="white" style={{flex: 0.5, textAlign: 'right'}}>JJG</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="Detail SPB Local"
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.SPB_LOCAL_FORM, {
              divisionId, date, organizationName, divisionName, editItem: item
            })}
            style={{padding: 8}}>
            <AntDesign name="edit" size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={item?.items || []}
        keyExtractor={(row, i) => row.id || String(i)}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{paddingBottom: 24}}
      />
    </SafeAreaView>
  )
}

export default SPBLocalDetail

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  header: {
    marginHorizontal: 18,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 12,
  },
  rowCell: {flex: 1},
})
