import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
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
import System from '@app/domain/services/System'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface SpbLocalItem {
  tphId: string
  blockId: string
  blockCode: string
  plantingYear: string
  tphName: string
  janjang: string
  sisaJanjang: number
}

const SPBLocalForm = () => {
  const navigation: any = useNavigation()
  const dispatch: any = useDispatch()
  const route: any = useRoute()
  const {divisionId, date, organizationId, organizationName, divisionName, editItem} = route.params || {}
  const isEdit = Boolean(editItem)

  const formStatus = useSpbLocalFormStatus()
  const draftOptionsCache = useSelector((state: RootStateType) => state.tonnageGarden?.draftOptions?.data || [])

  const [items, setItems] = useState<SpbLocalItem[]>(() => {
    if (!editItem?.items) return []
    return editItem.items.map((i: any) => ({
      tphId: i.tph?.id || i.tphId || '',
      blockId: i.block?.id || i.blockId || '',
      blockCode: i.block?.code || i.blockCode || '-',
      plantingYear: i.plantingYear || '-',
      tphName: i.tph?.name || i.tphName || '-',
      janjang: String(i.janjang || 0),
      sisaJanjang: i.janjang || 0,
    }))
  })
  const [selectedGardenTonnageId, setSelectedGardenTonnageId] = useState(editItem?.gardenTonnage?.id || editItem?.gardenTonnageId || '')

  const {control} = useForm({defaultValues: {gardenTonnageId: editItem?.gardenTonnage?.id || ''}})

  // Filter draft options by date
  const draftOptions = draftOptionsCache.filter((d: any) => {
    const draftDate = moment(d.date).format('YYYY-MM-DD')
    return draftDate === date
  })

  const kendaraanOptions = draftOptions.map((d: any) => ({
    value: d.id,
    label: d.item ? `${d.item.name} - ${d.item.serialNumber} (${d.driver || 'Tanpa Supir'})` : d.id,
  }))

  const [monitoringData, setMonitoringData] = useState<any[]>([])
  const [monitoringLoading, setMonitoringLoading] = useState(true)

  useEffect(() => {
    // Fetch draft options for kendaraan dropdown
    dispatch(actions.getDraftOptions.request({loading: true, data: {organizationId, date}}))
    // Fetch monitoring TPH data directly (bypass Redux to get fresh data)
    const monthYear = moment(date)
    setMonitoringLoading(true)
    System.instance.monitoringTphService.list({
      divisionId,
      month: monthYear.format('M'),
      year: monthYear.format('YYYY'),
      limit: 9999,
    }).then((res: any) => {
      const responseData = res?.data?.response
      const docs = Array.isArray(responseData?.docs) ? responseData.docs : Array.isArray(responseData) ? responseData : []
      // Filter by exact date to get correct sisaJanjang for this specific day
      const dateStr = moment(date).format('YYYY-MM-DD')
      const filtered = docs.filter((d: any) => moment(d.date).format('YYYY-MM-DD') === dateStr)
      setMonitoringData(filtered)
    }).catch(() => setMonitoringData([]))
      .finally(() => setMonitoringLoading(false))
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

const handleScanResult = (data: any) => {
    if (!data) return
    const exists = items.find(i => i.tphId === data.tphId)
    if (exists) {
      showErrorToast('TPH sudah ditambahkan')
      return
    }
    const matchingTph = monitoringData.find((m: any) =>
      (m.tphId || m.tph?.id) === data.tphId ||
      m.tphCode === data.tphCode
    )
    const sisaJanjang = matchingTph?.sisaJanjang ?? 0
    setItems(prev => [
      ...prev,
      {
        tphId: data.tphId,
        blockId: data.blockId,
        blockCode: data.blockCode || data.blockName || '-',
        plantingYear: data.plantingYear?.[0]?.toString() || '-',
        tphName: data.tphName || '-',
        janjang: String(sisaJanjang),
        sisaJanjang: sisaJanjang,
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
    const payload = {
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
    }
    if (isEdit) {
      System.instance.spbLocalService.update(editItem.id, payload)
        .then(() => { showSuccessToast('SPB Local berhasil diubah'); navigation.goBack() })
        .catch(() => showErrorToast('Gagal mengubah SPB Local'))
    } else {
      dispatch(actions.spbLocal.createSpbLocal.request({loading: true, data: payload}))
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah SPB Local' : 'Tambah SPB Local'} />
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

        {items.map((item, index) => (
          <View key={`${item.tphId}-${index}`} style={styles.itemCard}>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(index)}>
              <AntDesign name="delete" size={18} color={theme.colors.black} />
            </TouchableOpacity>
            <Row>
              <View>
                <Text size={12} color={theme.colors.label}>Blok</Text>
                <Text size={13} type="semibold">{item.blockCode}</Text>
              </View>
              <View>
                <Text size={12} color={theme.colors.label}>Tahun Tanam</Text>
                <Text size={13} type="semibold">{item.plantingYear}</Text>
              </View>
            </Row>
            <Row>
              <View>
                <Text size={12} color={theme.colors.label}>TPH</Text>
                <Text size={13} type="semibold">{item.tphName}</Text>
              </View>
              <View>
                <Text size={12} color={theme.colors.label}>Sisa Janjang</Text>
                <Text size={13} type="semibold">{Math.max(0, item.sisaJanjang - (parseInt(item.janjang) || 0))}</Text>
              </View>
            </Row>
            <TextInput
              label="Jumlah Janjang"
              control={control}
              name={`items[${index}].janjang`}
              placeholder="0"
              value={item.janjang}
              onChangeText={(v: any) => handleChangeJanjang(index, v)}
              isNumber
              isRequired
            />
          </View>
        ))}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.addBtn, {backgroundColor: monitoringLoading ? theme.colors.grey : (theme.colors.black || '#333')}, monitoringLoading && {opacity: 0.6}]}
            disabled={monitoringLoading}
            onPress={() => navigation.navigate(Routes.QR_SCANNER, {onScanSuccess: handleScanResult})}>
            <Icon name="qr-code-scanner" size={18} color="white" />
            <Text color="white" size={12} style={{marginLeft: 4}}>{monitoringLoading ? 'Loading...' : 'Scan'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.submitWrap}>
        <Button
          disabled={formStatus?.loading}
          onPress={handleSubmit}>
          <Text color="white">{formStatus?.loading ? 'Loading...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

const Row = ({children}: any) => (
  <View style={{flexDirection: 'row', marginBottom: 8}}>
    <View style={{marginRight: 5, flex: 1}}>{React.Children.toArray(children)[0]}</View>
    <View style={{marginLeft: 5, flex: 1}}>{React.Children.toArray(children)[1]}</View>
  </View>
)

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
    backgroundColor: theme.colors.light2,
    borderRadius: 10,
    padding: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  removeBtn: {position: 'absolute', top: 0, right: 0, padding: 16, zIndex: 1},
  submitWrap: {padding: 16, borderTopWidth: 1, borderTopColor: '#eee'},
})
