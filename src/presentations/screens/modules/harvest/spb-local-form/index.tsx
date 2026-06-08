import React, {useEffect, useState} from 'react'
import {Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Button, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation, useRoute} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {useSpbLocalFormStatus} from '@app/domain/states/spb-local/hooks'
import {useMonitoringTphList} from '@app/domain/states/monitoring-tph/hooks'
import {theme} from '@app/presentations/utils/styles'
import {useForm} from 'react-hook-form'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface SpbLocalItem {
  tphId: string
  blockId: string
  blockName: string
  plantingYear: string
  tphName: string
  janjang: string
  sisaJanjang: number
}

const SPBLocalForm = () => {
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const {divisionId, date, organizationName, divisionName} = route.params || {}

  const formStatus = useSpbLocalFormStatus()
  const monitoringTphList = useMonitoringTphList()
  const draftOptionsCache = useSelector((state: RootStateType) => state.tonnageGarden?.draftOptions?.data || [])

  const [items, setItems] = useState<SpbLocalItem[]>([])
  const [selectedGardenTonnageId, setSelectedGardenTonnageId] = useState('')

  const {control} = useForm({defaultValues: {gardenTonnageId: ''}})

  // Filter draft options by date
  const draftOptions = draftOptionsCache.filter((d: any) => {
    const draftDate = moment(d.date).format('YYYY-MM-DD')
    return draftDate === date
  })

  const kendaraanOptions = draftOptions.map((d: any) => ({
    value: d.id,
    label: d.item ? `${d.item.name} - ${d.item.serialNumber} (${d.driver || 'Tanpa Supir'})` : d.id,
  }))

  useEffect(() => {
    // Fetch draft options for kendaraan dropdown
    dispatch(actions.getDraftOptions.request({loading: true, data: {date}}))
    // Fetch monitoring TPH data for picking
    const monthYear = moment(date)
    dispatch(actions.monitoringTph.getMonitoringTphList.request({
      loading: true,
      data: {divisionId, month: monthYear.format('MM'), year: monthYear.format('YYYY')},
    }))
  }, [])

  useEffect(() => {
    if (formStatus?.data) {
      showSuccessToast('SPB Local berhasil disimpan')
      dispatch(actions.spbLocal.clearSpbLocalForm())
      navigation.goBack()
    }
    if (formStatus?.error) {
      showErrorToast(formStatus.error?.message || 'Gagal menyimpan')
      dispatch(actions.spbLocal.clearSpbLocalForm())
    }
  }, [formStatus])

  const handleAddFromMonitoring = () => {
    const monitoringData = monitoringTphList?.data?.docs || monitoringTphList?.data || []
    if (!Array.isArray(monitoringData) || monitoringData.length === 0) {
      showErrorToast('Tidak ada data monitoring TPH')
      return
    }
    // Show picker from monitoring data: filter out already-added tph
    const existingTphIds = items.map(i => i.tphId)
    const available = monitoringData.filter((m: any) => !existingTphIds.includes(m.tphId || m.tph?.id))
    if (available.length === 0) {
      showErrorToast('Semua TPH sudah ditambahkan')
      return
    }
    // Add first available item (simple picker; in production use modal)
    const pick = available[0]
    setItems(prev => [
      ...prev,
      {
        tphId: pick.tphId || pick.tph?.id,
        blockId: pick.blockId || pick.block?.id,
        blockName: pick.blockName || pick.block?.name || '-',
        plantingYear: pick.plantingYear?.toString() || '-',
        tphName: pick.tphName || pick.tph?.name || '-',
        janjang: String(pick.sisaJanjang || pick.sisa || 0),
        sisaJanjang: pick.sisaJanjang || pick.sisa || 0,
      },
    ])
  }

  const handleScanResult = (data: any) => {
    if (!data) return
    const exists = items.find(i => i.tphId === data.tphId)
    if (exists) {
      showErrorToast('TPH sudah ditambahkan')
      return
    }
    setItems(prev => [
      ...prev,
      {
        tphId: data.tphId,
        blockId: data.blockId,
        blockName: data.blockName || '-',
        plantingYear: data.plantingYear?.[0]?.toString() || '-',
        tphName: data.tphName || '-',
        janjang: String(data.sisaJanjang || 0),
        sisaJanjang: data.sisaJanjang || 0,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleChangeJanjang = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? {...item, janjang: value} : item))
  }

  const validate = (): boolean => {
    if (!selectedGardenTonnageId) {
      showErrorToast('Pilih kendaraan terlebih dahulu')
      return false
    }
    if (items.length === 0) {
      showErrorToast('Tambah minimal 1 TPH')
      return false
    }
    for (const item of items) {
      const janjang = parseInt(item.janjang || '0')
      if (janjang <= 0) {
        showErrorToast(`Jumlah janjang harus > 0 (TPH: ${item.tphName})`)
        return false
      }
      if (janjang > item.sisaJanjang) {
        showErrorToast(`Janjang melebihi sisa (TPH: ${item.tphName}, max: ${item.sisaJanjang})`)
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (!validate()) return
    dispatch(actions.spbLocal.createSpbLocal.request({
      loading: true,
      data: {
        divisionId,
        date,
        gardenTonnageId: selectedGardenTonnageId,
        items: items.map(item => ({
          tphId: item.tphId,
          blockId: item.blockId,
          plantingYear: item.plantingYear,
          janjang: parseInt(item.janjang),
          bpbksDate: date,
        })),
      },
    }))
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tambah SPB Local" />
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.readonlyRow}>
          <Text size={12} color={theme.colors.grey}>Tanggal</Text>
          <Text type="semibold" size={14}>{moment(date).format('D MMMM YYYY')}</Text>
        </View>

        <SelectInput
          label="Kendaraan"
          placeholder={kendaraanOptions.length === 0 ? 'Loading kendaraan...' : 'Pilih kendaraan'}
          control={control}
          name="gardenTonnageId"
          items={kendaraanOptions}
          onChange={(v: string) => setSelectedGardenTonnageId(v)}
          isRequired
          noItemsText="Tidak ada kendaraan tersedia"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddFromMonitoring}>
            <Icon name="add-circle-outline" size={18} color="white" />
            <Text color="white" size={12} style={{marginLeft: 4}}>Tambah</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, {backgroundColor: theme.colors.black || '#333'}]}
            onPress={() => navigation.navigate(Routes.QR_SCANNER, {onScanSuccess: handleScanResult})}>
            <Icon name="qr-code-scanner" size={18} color="white" />
            <Text color="white" size={12} style={{marginLeft: 4}}>Scan</Text>
          </TouchableOpacity>
        </View>

        {items.map((item, index) => (
          <View key={`${item.tphId}-${index}`} style={styles.itemCard}>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(index)}>
              <AntDesign name="closecircle" size={18} color={theme.colors.danger || 'red'} />
            </TouchableOpacity>
            <View style={styles.itemRow}>
              <Text size={12} color={theme.colors.grey}>Blok</Text>
              <Text size={13} type="semibold">{item.blockName}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text size={12} color={theme.colors.grey}>Tahun Tanam</Text>
              <Text size={13} type="semibold">{item.plantingYear}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text size={12} color={theme.colors.grey}>TPH</Text>
              <Text size={13} type="semibold">{item.tphName}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text size={12} color={theme.colors.grey}>Sisa Janjang</Text>
              <Text size={13} type="semibold">{item.sisaJanjang}</Text>
            </View>
            <View style={{marginTop: 8}}>
              <Text size={12} color={theme.colors.grey}>Jumlah Janjang</Text>
              <View style={styles.janjangInput}>
                <TextInput
                  control={control}
                  name={`items[${index}].janjang`}
                  placeholder="0"
                  value={item.janjang}
                  onChangeText={(v: any) => handleChangeJanjang(index, v)}
                  isNumber
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.submitWrap}>
        <Button
          disabled={formStatus?.loading}
          onPress={handleSubmit}>
          <Text color="white">{formStatus?.loading ? 'Loading...' : 'Simpan'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default SPBLocalForm

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  container: {padding: 16},
  readonlyRow: {marginBottom: 12},
  buttonRow: {flexDirection: 'row', gap: 8, marginVertical: 12},
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  itemCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  removeBtn: {position: 'absolute', top: 8, right: 8, zIndex: 1},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4},
  janjangInput: {marginTop: 4},
  submitWrap: {padding: 16, borderTopWidth: 1, borderTopColor: '#eee'},
})
