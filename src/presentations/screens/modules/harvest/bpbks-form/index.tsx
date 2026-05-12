import { theme } from '@app/presentations/utils/styles'
import { Button, Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import SyncIndicatorBadge from '@app/presentations/_shared-components/SyncIndicatorBadge'
import SyncStatusModal from '@app/presentations/_shared-components/SyncStatusModal'
import React, { useEffect, useState, useRef } from 'react'
import { Image, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { useNavigation } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { useUsersByDivision } from '@app/domain/states/user/hooks'
import flux, { actions, RootStateType } from '@domain/states/store'
import { showErrorToast, showInfoToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useRoute } from '@react-navigation/native'
import * as schema from '@utils/validation/bpbks-form-validation'
import { styles } from './style'
import { IBPBKSFormDataCreate, IBPBKSFormDataUpdate } from '@app/models/eplant/BPBKS'
import { ITonnageGardenDraftOption } from '@app/models/eplant/TonnageGarden'
import { useBlockOptions, useBlocksWithPlantingYearByDivisionStd } from '@app/domain/states/block/hooks'
import moment from 'moment'
import { checkIfDuplicateExists } from '@app/presentations/utils/check'
import IOption from '@app/models/commons/IOption'
import { useBPBKSLists } from '@app/domain/states/bpbks/hooks'
import System from '@app/domain/services/System'
import Routes from '@app/presentations/navigation/Routes'
import NetInfo from '@react-native-community/netinfo'

const BPBKSForm = () => {
  const route: any = useRoute()
  const scrollViewRef: any = useRef()

  const item = route.params?.item
  let bpbksData = route.params?.bpbksData
  const params = {
    organizationId: bpbksData?.organization?.value,
    divisionId: bpbksData?.division?.id,
    foremanId: bpbksData?.foreman?.id,
    date: bpbksData?.date,
  }

  const { docs, hasOffline } = useBPBKSLists(params)
  const tphs = route.params?.tphs
  const isEdit = Boolean(item?.id || item?.tempId)

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.bpbksValidationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      date: bpbksData?.date,
      harvesterId: item?.harvester?.id || item?.harvesterId,
      cutNumber: item?.cutNumber?.toString(),
      organizationId: bpbksData?.organization?.value,
      divisionId: bpbksData?.division?.id,
      foremanId: bpbksData?.foreman?.id,
      numberOfLength: item?.tph[0]?.numberOfLength != null ? String(Number(item.tph[0].numberOfLength)) : '',
      loose: item?.tph[0]?.loose != null ? String(Number(item.tph[0].loose)) : '',
      ripeFruitChecked: item?.tph[0]?.ripeFruitChecked != null ? String(Number(item.tph[0].ripeFruitChecked)) : '',
      rawFruitChecked: item?.tph[0]?.rawFruitChecked != null ? String(Number(item.tph[0].rawFruitChecked)) : '',
      lateRipeChecked: item?.tph[0]?.lateRipeChecked != null ? String(Number(item.tph[0].lateRipeChecked)) : '',
      rottenFruitChecked: item?.tph[0]?.rottenFruitChecked != null ? String(Number(item.tph[0].rottenFruitChecked)) : '',
      longHandleChecked: item?.tph[0]?.longHandleChecked != null ? String(Number(item.tph[0].longHandleChecked)) : '',
      looseChecked: item?.tph[0]?.looseChecked != null ? String(Number(item.tph[0].looseChecked)) : '',
      plantingYear: item?.tph[0]?.plantingYear != undefined ? item.tph[0].plantingYear.toString() : '2012'
    },
  })

  const [selectedUser, setSelectedUser] = useState(item?.harvester?.id || item?.harvesterId || '')
  const [defaultTph, setDefaultTph] = useState([])
  const [draftOptions, setDraftOptions] = useState<ITonnageGardenDraftOption[]>([])
  const [selectedGardenTonnageId, setSelectedGardenTonnageId] = useState<string>('')
  const [syncModalVisible, setSyncModalVisible] = useState(false)
  const [tphForm, setTphForm] = useState(isEdit ? [
    {
      blockId: item?.tph?.block?.id || item?.blockId,
      plantingYear: item?.plantingYear,
      tphId: item?.tph?.id || item?.tphId,
      numberOfLength: item?.numberOfLength != null ? String(Number(item.numberOfLength)) : '',
      ripeFruitChecked: item?.ripeFruitChecked != null ? String(Number(item.ripeFruitChecked)) : '',
      rawFruitChecked: item?.rawFruitChecked != null ? String(Number(item.rawFruitChecked)) : '',
      lateRipeChecked: item?.lateRipeChecked != null ? String(Number(item.lateRipeChecked)) : '',
      rottenFruitChecked: item?.rottenFruitChecked != null ? String(Number(item.rottenFruitChecked)) : '',
      longHandleChecked: item?.longHandleChecked != null ? String(Number(item.longHandleChecked)) : '',
      looseChecked: item?.looseChecked != null ? String(Number(item.looseChecked)) : '',
    },
  ] : [])

  const formBPBKSStatus = useSelector((state: RootStateType) => state.bpbks.formBPBKSStatus)
  const userAll = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  const tphAll = useSelector((state: RootStateType) => {
    return state.tph?.tphAll?.data || []
  })
  const user = userAll.find(e => e.id === selectedUser)
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  const users = useUsersByDivision(bpbksData?.division?.id)
  const blocks = useBlocksWithPlantingYearByDivisionStd(bpbksData?.division?.id)

  const isConnected = useSelector((state: RootStateType) => state.network.isConnected)
  const draftOptionsCache = useSelector((state: RootStateType) => state.tonnageGarden?.draftOptions?.data || [])

  // DEBUG: Log untuk cek data
  useEffect(() => {
    console.log('🔍 DEBUG BPBKS Form:')
    console.log('- isConnected:', isConnected)
    console.log('- users length:', users.length)
    console.log('- draftOptions length:', draftOptions.length)
    console.log('- blocks length:', blocks.length)
    console.log('- tphAll length:', tphAll.length)
    console.log('- draftOptionsCache length:', draftOptionsCache.length)
    
    if (!isConnected) {
      console.log('⚠️ OFFLINE MODE: Using cached data')
      console.log('  - Cached users:', users.length)
      console.log('  - Cached draft options:', draftOptionsCache.length)
      console.log('  - Cached blocks:', blocks.length)
      console.log('  - Cached TPH:', tphAll.length)
    }
  }, [users, draftOptions, isConnected, blocks, tphAll, draftOptionsCache])

  useEffect(() => {
    // Set draft options dari cache dengan FILTER TANGGAL
    // Hanya tampilkan draft options yang sesuai dengan tanggal form
    if (draftOptionsCache && draftOptionsCache.length > 0 && bpbksData?.date) {
      const formDate = moment(bpbksData.date).format('YYYY-MM-DD')
      
      // Filter: hanya ambil draft options yang tanggalnya sama dengan form
      const filteredByDate = draftOptionsCache.filter((draft: any) => {
        const draftDate = moment(draft.date).format('YYYY-MM-DD')
        return draftDate === formDate
      })
      
      console.log('✅ Loading draft options from cache:', draftOptionsCache.length)
      console.log('📅 Filtered by date:', formDate, '→', filteredByDate.length, 'items')
      
      setDraftOptions(filteredByDate as any)
    } else if (bpbksData?.date) {
      // Jika tidak ada cache atau cache kosong, reset draft options
      setDraftOptions([])
    }
  }, [draftOptionsCache, bpbksData?.date])

  useEffect(() => {
    if (!isEdit && bpbksData?.organization?.value && bpbksData?.date) {
      const dateStr = moment(bpbksData.date).format('YYYY-MM-DD')
      
      console.log('🔄 Fetching draft options...')
      console.log('  - Organization:', bpbksData.organization.value)
      console.log('  - Date:', dateStr)
      console.log('  - Is Connected:', isConnected)
      
      // Selalu coba fetch saat form dibuka
      // - Online: akan fetch data terbaru dari server (REFRESH) ✅
      // - Offline: akan gagal, tapi data cache tetap tersedia
      dispatch(actions.getDraftOptions.request({
        loading: !isConnected, // Hanya show loading jika online
        data: {
          organizationId: bpbksData.organization.value,
          date: dateStr,
        },
      }))
      
      if (!isConnected) {
        console.log('⚠️ Offline: Will use cached draft options')
        console.log('⚠️ WARNING: Data mungkin tidak up-to-date!')
      } else {
        console.log('🌐 Online: Fetching fresh draft options from server')
      }
    }
  }, [bpbksData?.organization?.value, bpbksData?.date, isConnected])

  useEffect(() => {
    if (!isEdit && selectedUser) {
      const data = tphs
        ?.filter((e: any) => e?.harvester?.id === selectedUser)
        .map((e: any) => {
          return {
            blockId: e?.tph?.block?.id || e?.blockId,
            plantingYear: e?.plantingYear?.toString(),
            tphId: e?.tph?.id || e?.tphId,
            numberOfLength: e?.numberOfLength?.toString(),
            ripeFruitChecked: e?.ripeFruitChecked?.toString(),
            rawFruitChecked: e?.rawFruitChecked?.toString(),
            lateRipeChecked: e?.lateRipeChecked?.toString(),
            rottenFruitChecked: e?.rottenFruitChecked?.toString(),
            longHandleChecked: e?.longHandleChecked?.toString(),
            looseChecked: e?.looseChecked?.toString(),
            viewOnly: true,
          }
        })


      setDefaultTph(data)
    }
  }, [selectedUser])

  const checkIsBlockAndPlantingYearIsSame = (arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      const isFound = arr.find((a, j) => {
        return a.tphId == arr[i].tphId && j != i
      })
      if (isFound) {
        return true
      }
    }
    return false
  }

  const checkIsAlreadyUsedByOtherData = () => {

  }

  const validateTPH = () => {
    if (tphForm.length === 0) {
      showErrorToast('Harap tambah TPH terlebih dahulu!')
      return false
    }

    const all = [...tphForm, ...defaultTph]

    if (checkIsBlockAndPlantingYearIsSame(all)) {
      showErrorToast('Tidak boleh ada TPH yang sama!')
      return false
    }

    // if (checkIsBlockAndPlantingYearAndTPHIsSame()) {
    //   return
    // }
    const fieldTph = [
      'tphId',
      'blockId',
      'plantingYear',
      'numberOfLength',
      'rawFruitChecked',
      'lateRipeChecked',
      'rottenFruitChecked',
      'longHandleChecked',
      'looseChecked',
    ]
    if (tphForm.some((e: any) => !fieldTph.every((f: string) => e[f]))) {
      showErrorToast('Harap lengkapi semua data TPH!')
      return false
    }

    if (isEdit) {
      for (let i = 0; i < docs?.length; i++) {
        //@ts-ignore
        if (docs[i].block?.id == tphForm[0].blockId && docs[i]?.plantingYear == tphForm[0]?.plantingYear) {
          if (item?.employeeTempId) {
            //@ts-ignore
            if (item?.employeeTempId != docs[i]?.employeeTempId) {
              showErrorToast('Data Blok dan Tahun Tanam sudah dipakai.')
              return
            }
          }
        }
      }
    }
    if (!isEdit && tphForm.some((e: any) => !e.photoFruitFront || !e.photoFruitBack || !e.photoFruitSide || !e.photoKrani)) {
      showErrorToast('Foto Buah (depan, belakang, samping) dan Foto Krani wajib diisi!')
      return false
    }

    const isRipeFruiteLessThanZero = tphForm.some((e: any) => {
      const ripeFruitChecked = calculateRipeFruit(e)
      if (ripeFruitChecked < 0) {
        return true
      }
      return false
    })
    if (isRipeFruiteLessThanZero) {
      showErrorToast('Buah Matang tidak boleh kurang dari 0!')
      return false
    }
    return true
  }
  const constructToFormDataCreate = (value: any) => {
    const data: IBPBKSFormDataCreate = {
      // ...value,
      harvesterId: selectedUser,
      divisionId: value.divisionId,
      cutNumber: value.cutNumber,
      foremanId: value.foremanId,
      date: moment(value.date).format('YYYY-MM-DD'),
      gardenTonnageId: selectedGardenTonnageId || undefined,
      tphs: tphForm.map((e: any, index: number) => {
        const tph = tphAll.find(w => w.id === e.tphId)
        const block = blockAll.find(b => b.id === e.blockId)
        return {
          ...e,
          ripeFruitChecked: calculateRipeFruit(e),
          tph: tph,
          block: block,
          harvester: user,
          harvesterId: selectedUser,
        }
      }),
    }
    return data
  }
  const constructToFormDataUpdate = (value: any) => {
    const [tph] = tphForm
    const ripeFruitChecked = calculateRipeFruit(tph)
    const data: IBPBKSFormDataUpdate = {
      ...value,
      foremanId: value.foremanId,
      harvesterId: selectedUser,
      cutNumber: value.cutNumber,
      harvester: user,
      ...tph,
      ripeFruitChecked,
    }
    return data
  }

  const onSubmit = async (value: any) => {
    // Double-check koneksi langsung dari device
    const netInfoState = await NetInfo.fetch()
    const isActuallyConnected = netInfoState.isConnected && netInfoState.isInternetReachable !== false
    
    console.log('🔍 Network Debug:')
    console.log('  - isConnected from Redux:', isConnected)
    console.log('  - isConnected from NetInfo:', netInfoState.isConnected)
    console.log('  - isInternetReachable:', netInfoState.isInternetReachable)
    console.log('  - Connection type:', netInfoState.type)
    console.log('  - Actually connected:', isActuallyConnected)
    
    // Validasi No. Kendaraan (wajib)
    if (!isEdit && !selectedGardenTonnageId) {
      showErrorToast('No. Kendaraan (Tonase Draft) wajib dipilih!')
      return
    }
    
    // Validasi TPH
    if (!validateTPH()) {
      return
    }
    
    // Mode Edit
    if (isEdit) {
      const requestBody = constructToFormDataUpdate(value)
      dispatch(actions.editBPBKS.request({ loading: true, data: requestBody }))
      return
    }

    // Mode Create
    const requestBodyCreate = constructToFormDataCreate(value)
    
    // GUNAKAN NetInfo langsung untuk deteksi koneksi yang lebih akurat
    if (!isActuallyConnected) {
      const syncId = `BPBKS_${Date.now()}`
      
      console.log('💾 OFFLINE: Saving BPBKS to sync queue')
      console.log('  - Sync ID:', syncId)
      console.log('  - Harvester:', selectedUser)
      console.log('  - Vehicle:', selectedGardenTonnageId)
      console.log('  - TPH count:', tphForm.length)
      console.log('  - Has photos:', tphForm.some((t: any) => t.photoKrani))
      
      dispatch(actions.syncQueue.addToSyncQueue({
        id: syncId,
        type: 'BPBKS',
        data: requestBodyCreate,
        timestamp: Date.now(),
        status: 'pending',
      }))
      
      showInfoToast('✅ Data disimpan lokal. Akan tersinkronisasi saat online.')
      navigation.goBack()
      return
    }

    // ONLINE MODE: Direct API call
    try {
      console.log('🌐 ONLINE: Submitting BPBKS to server')
      const res: any = await System.instance.bpbksService.createBPBKS(requestBodyCreate)
      const createdTphs = res?.data?.response?.tphs || []
      
      // Upload photos untuk setiap TPH
      for (let i = 0; i < tphForm.length; i++) {
        const tph = tphForm[i] as any
        const createdTph = createdTphs[i]
        if (createdTph?.id && (tph.photoFruitFront || tph.photoFruitBack || tph.photoFruitSide || tph.photoKrani)) {
          try {
            await System.instance.bpbksService.uploadPhotos(createdTph.id, {
              photoFruitFront: tph.photoFruitFront,
              photoFruitBack: tph.photoFruitBack,
              photoFruitSide: tph.photoFruitSide,
              photoKrani: tph.photoKrani,
            })
          } catch (photoError) {
            console.error('Failed to upload photo:', photoError)
          }
        }
      }
      
      // Refresh list BPBKS setelah create berhasil
      dispatch(actions.getBPBKSAll.request({
        loading: false,
        data: {
          organizationId: params.organizationId,
          divisionId: params.divisionId,
          foremanId: params.foremanId,
          date: params.date,
        },
      }))
      
      showSuccessToast('✅ Berhasil disimpan')
      navigation.goBack()
    } catch (e: any) {
      console.error('❌ Failed to submit BPBKS:', e)
      showErrorToast(e?.response?.data?.message?.id || 'Gagal menyimpan')
    }
  }

  const setFieldTphForm = (index: number, field: any, value: any) => {
    const newTphForm = tphForm.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    setTphForm(newTphForm)
  }

  // Sync tphForm state to react-hook-form so SelectInput (controlled) shows correct values
  useEffect(() => {
    tphForm.forEach((tph: any, index: number) => {
      setValue(`[${index}]blockId`, tph.blockId)
      setValue(`[${index}]plantingYear`, tph.plantingYear?.toString())
      setValue(`[${index}]tphId`, tph.tphId)
    })
  }, [tphForm])

  useEffect(() => {
    console.log('🚀 Initializing BPBKS Form - Fetching master data...')
    dispatch(actions.clearFormBPBKSStatus())
    
    // Force refresh master data setiap kali form dibuka
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getTPHAll.request({ loading: true }))
    dispatch(actions.getAllBlock.request({ loading: true }))
    
    // Pre-fetch draft options jika ada organization dan date
    // Ini akan di-cache untuk offline access
    if (bpbksData?.organization?.value && bpbksData?.date) {
      dispatch(actions.getDraftOptions.request({
        loading: true,
        data: {
          organizationId: bpbksData.organization.value,
          date: moment(bpbksData.date).format('YYYY-MM-DD'),
        },
      }))
    }
    
    console.log('✅ Master data fetch dispatched')
  }, [])

  useEffect(() => {
    const error = formBPBKSStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formBPBKSStatus?.error])

  useEffect(() => {
    const data = formBPBKSStatus?.data?.data
    if (data?.code == 200) {
      showSuccessToast(`${isEdit ? 'Berhasil diperbarui' : 'Berhasil disimpan'}`)
      navigation.goBack()
    }
  }, [formBPBKSStatus?.data])

  const HeaderView = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
      <Header title={isEdit ? 'Ubah PMB' : 'Tambah PMB'} />
      <TouchableOpacity onPress={() => setSyncModalVisible(true)}>
        <SyncIndicatorBadge size="small" showLabel={false} />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <SyncStatusModal visible={syncModalVisible} onClose={() => setSyncModalVisible(false)} />
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Row>
          <TextInput
            label="Tanggal"
            control={control}
            name="date"
            disabled
            disabledText={moment(bpbksData?.date).format('D MMMM YYYY')}
            value={bpbksData?.date}
            isRequired
          />
          <TextInput
            label="Organisasi"
            control={control}
            name="organizationId"
            disabledText={bpbksData?.organization?.label || '-'}
            value={bpbksData?.organization?.value}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <TextInput
            label="Divisi"
            control={control}
            name="divisionId"
            disabledText={bpbksData?.division?.name}
            value={bpbksData?.division?.id}
            disabled
            isRequired
          />
          <TextInput
            label="Mandor"
            control={control}
            name="foremanId"
            disabledText={bpbksData?.foreman?.name}
            value={bpbksData?.foreman?.id}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <SelectInput
            label="Nama Karyawan"
            placeholder={users.length === 0 ? 'Loading karyawan...' : 'Contoh : Dedi'}
            control={control}
            items={users}
            disabled={isEdit}
            disabledText={item?.harvester?.name || user?.name}
            name="harvesterId"
            onChange={v => setSelectedUser(v)}
            isRequired
            noItemsText="Tidak ada karyawan di divisi ini"
          />
          <TextInput
            isFloat={false}
            label="No. Potong"
            control={control}
            placeholder="Contoh: 12345"
            name="cutNumber"
            isRequired
            isNumber
          />
        </Row>
        {!isEdit && (
          <SelectInput
            label="No. Kendaraan (Tonase Draft)"
            placeholder={draftOptions.length === 0 ? 'Loading kendaraan...' : 'Pilih kendaraan dari tonase draft'}
            control={control}
            name="gardenTonnageId"
            items={draftOptions.map(d => ({
              value: d.id,
              label: d.item ? `${d.item.name} - ${d.item.serialNumber} (${d.driver || 'Tanpa Supir'})` : d.id,
            }))}
            onChange={(v: string) => setSelectedGardenTonnageId(v)}
            isRequired
            noItemsText="Tidak ada kendaraan tersedia untuk tanggal ini"
          />
        )}
        {isEdit && (
          <TextInput
            label="No. Kendaraan"
            control={control}
            name="gardenTonnageId"
            disabled
            disabledText={
              item?.bpbks?.gardenTonnage?.item?.name
                ? `${item.bpbks.gardenTonnage.item.name} - ${item.bpbks.gardenTonnage.item.serialNumber || ''}`
                : '-'
            }
          />
        )}

        {defaultTph?.map((v, i) => (
          <TPHView
            item={v}
            key={i}
            index={i}
            blocks={blocks}
            tphAll={tphAll}
            isEdit={isEdit}
            control={control}
            setValue={setValue}
            blockAll={blockAll}
          />
        ))}
        {tphForm.map((v, i) => (
          <TPHView
            item={v}
            key={i}
            index={i}
            blocks={blocks}
            tphAll={tphAll}
            isEdit={isEdit}
            control={control}
            setValue={setValue}
            blockAll={blockAll}
            onDelete={() => {
              const newTphForm = tphForm.filter((_, idx) => idx !== i)
              setTphForm(newTphForm)
            }}
            setFieldTphForm={setFieldTphForm}
          />
        ))}

        {!isEdit && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-start', marginBottom: 16, padding: 12, backgroundColor: theme.colors.accent, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              navigation.navigate(Routes.QR_SCANNER, {
                onScanSuccess: (data: any) => {
                  setTphForm((prev: any) => [
                    ...prev,
                    {
                      blockId: data.blockId,
                      plantingYear: data.plantingYear?.[0]?.toString() || '',
                      tphId: data.tphId,
                      numberOfLength: '0',
                      ripeFruitChecked: '0',
                      rawFruitChecked: '0',
                      lateRipeChecked: '0',
                      rottenFruitChecked: '0',
                      longHandleChecked: '0',
                      looseChecked: '0',
                      photoFruit: null,
                      photoKrani: null,
                      fromScan: true,
                    },
                  ])
                },
              })
            }}>
            <Icon name="qr-code-scanner" size={20} color="white" />
            <Text color="white" style={{ marginLeft: 8, fontSize: 13 }}>Scan QR TPH</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <View style={styles.wrapSubmitButton}>
        <Button
          style={{ marginBottom: 26 }}
          disabled={Boolean(formBPBKSStatus?.loading || !isValid)}
          onPress={handleSubmit(onSubmit)}>
          <Text color="white">{formBPBKSStatus?.loading ? 'Loading...' : 'Simpan'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

const TPHView = ({ isEdit, index, setFieldTphForm, control, blocks, blockAll, tphAll, onDelete, item }: any) => {
  const navigation: any = useNavigation()
  const blockDetail = blockAll.find((e: any) => e.id === item?.blockId)
  const ripeFruitChecked = `${calculateRipeFruit(item)}`
  const tphByBlock = tphAll?.filter((e: any) => e.block?.id === item?.blockId)
  const tphDetail = tphByBlock?.find((e: any) => e.id === item?.tphId)
  const tphOptions = tphByBlock?.map((e: any) => ({ value: e.id, label: e.name }))

  const transformPlantingYears = (): IOption[] => {
    const plantingYears = (blocks || [])?.find((b: any) => b.value == item?.blockId)?.plantingYear || []
    return plantingYears
  }

  return (
    <View
      style={{ backgroundColor: theme.colors.light2, padding: 16, borderRadius: 10, marginBottom: 16, paddingTop: 20 }}>
      {!isEdit && !item?.viewOnly && (
        <TouchableOpacity onPress={onDelete} style={{ position: 'absolute', right: 0, top: 0, padding: 16 }}>
          <AntDesign name={'delete'} size={18} color={theme.colors.black} />
        </TouchableOpacity>
      )}

      <Row>
        <SelectInput
          label="Blok"
          control={control}
          items={blocks}
          value={item?.blockId}
          disabled={item?.viewOnly || isEdit || item?.fromScan}
          disabledText={blockDetail?.code}
          placeholder="Pilih Blok"
          name={`[${index}]blockId`}
          errorText={item?.blockId?.length === 0 ? 'Blok harus diisi' : undefined}
          onChange={(value: any) => {
            setFieldTphForm(index, 'tphId', '')
            setFieldTphForm(index, 'plantingYear', '')
            setFieldTphForm(index, 'blockId', value)

          }}
          isRequired
        />
        <SelectInput
          disabled={item?.viewOnly || item?.fromScan}
          disabledText={item?.plantingYear?.toString()}
          isRequired
          items={transformPlantingYears() || []}
          value={item?.plantingYear != undefined ? item.plantingYear.toString() : ''}
          defaultValue={item?.plantingYear != undefined ? item.plantingYear.toString() : ''}
          control={control}
          label="Tahun Tanam"
          placeholder="Pilih Tahun Tanam"
          name={`[${index}]plantingYear`}
          errorText={item?.plantingYear?.length === 0 ? 'Tahun Tanam harus diisi' : undefined}
          onChange={v => {
            setFieldTphForm(index, 'plantingYear', v)
          }}
        />
      </Row>

      <Row>
        <SelectInput
          label={`TPH`}
          control={control}
          items={tphOptions}
          disabled={item?.viewOnly || item?.fromScan}
          disabledText={tphDetail?.name}
          value={item?.tphId}
          defaultValue={item?.tphId}
          placeholder="Pilih TPH"
          name={`[${index}]tphId`}
          errorText={item?.tphId?.length === 0 ? 'TPH harus diisi' : undefined}
          onChange={(value: any) => {
            setFieldTphForm(index, 'tphId', value)
          }}
          isRequired
        />
        <TextInput
          maxLines={1}
          label="Jumlah Janjang (JJG)"
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.numberOfLength}
          placeholder="Contoh: 1"
          name={`[${index}]numberOfLength`}
          defaultValue=""
          errorText={item?.numberOfLength?.length === 0 ? 'Jumlah Janjang harus diisi' : undefined}
          value={item?.numberOfLength}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'numberOfLength', value)
          }}
          isRequired
          isNumber
        />
      </Row>
      <Text size={12} type="semibold" style={{ marginVertical: 8 }}>
        Buah / Janjang yang di Periksa
      </Text>
      <Row>
        <TextInput
          label="Buah Matang (Janjang)"
          control={control}
          placeholder="0"
          name={`[${index}]ripeFruitChecked`}
          disabledText={ripeFruitChecked}
          value={ripeFruitChecked}
          errorText={
            parseInt(ripeFruitChecked) < 0
              ? 'Buah Matang (Janjang) tidak boleh kurang dari 0'
              : undefined
          }
          disabled
          isRequired
          isNumber
        />
        <TextInput
          label="Buah Mentah (Janjang)"
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.rawFruitChecked}
          placeholder="Contoh: 1"
          name={`[${index}]rawFruitChecked`}
          defaultValue=""
          errorText={item?.rawFruitChecked?.length === 0 ? 'Buah Mentah harus diisi' : undefined}
          value={item?.rawFruitChecked}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'rawFruitChecked', value)
          }}
          isRequired
          isNumber
        />
      </Row>
      <Row>
        <TextInput
          label="Lewat Matang (JJG)"
          maxLines={1}
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.lateRipeChecked}
          placeholder="Contoh: 1"
          name={`[${index}]lateRipeChecked`}
          defaultValue=""
          errorText={item?.lateRipeChecked?.length === 0 ? 'Lewat Matang harus diisi' : undefined}
          value={item?.lateRipeChecked}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'lateRipeChecked', value)
          }}
          isRequired
          isNumber
        />
        <TextInput
          label="Buah Busuk (JJG)"
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.rottenFruitChecked}
          placeholder="Contoh: 1"
          name={`[${index}]rottenFruitChecked`}
          defaultValue=""
          errorText={item?.rottenFruitChecked?.length === 0 ? 'Buah Busuk harus diisi' : undefined}
          value={item?.rottenFruitChecked}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'rottenFruitChecked', value)
          }}
          isRequired
          isNumber
        />
      </Row>
      <Row>
        <TextInput
          label="Gagang Panjang"
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.longHandleChecked}
          placeholder="Contoh: 1"
          name={`[${index}]longHandleChecked`}
          defaultValue=""
          errorText={item?.longHandleChecked?.length === 0 ? 'Gagang Panjang harus diisi' : undefined}
          value={item?.longHandleChecked}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'longHandleChecked', value)
          }}
          isRequired
          isNumber
        />
        <TextInput
          label="Brondolan (Kg)"
          control={control}
          disabled={item?.viewOnly}
          disabledText={item?.looseChecked}
          placeholder="Contoh: 1"
          name={`[${index}]looseChecked`}
          defaultValue=""
          errorText={item?.looseChecked?.length === 0 ? 'Brondolan harus diisi' : undefined}
          value={item?.looseChecked}
          onChangeText={(value: any) => {
            setFieldTphForm(index, 'looseChecked', value)
          }}
          isRequired
          isNumber
        />
      </Row>
      {!item?.viewOnly && !isEdit && (
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text size={12} type="semibold" style={{ marginBottom: 4 }}>Foto Krani</Text>
              <PhotoField
                label="Krani"
                photo={item?.photoKrani}
                onPress={() => navigation.navigate(Routes.CAMERA_PHOTO, {
                  onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoKrani', photo),
                })}
                isRequired
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text size={12} type="semibold" style={{ marginBottom: 4 }}>Foto Buah</Text>
              <PhotoField
                label="Depan"
                photo={item?.photoFruitFront}
                onPress={() => navigation.navigate(Routes.CAMERA_PHOTO, {
                  onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoFruitFront', photo),
                })}
                isRequired
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <PhotoField
                label="Belakang"
                photo={item?.photoFruitBack}
                onPress={() => navigation.navigate(Routes.CAMERA_PHOTO, {
                  onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoFruitBack', photo),
                })}
                isRequired
              />
            </View>
            <View style={{ flex: 1 }}>
              <PhotoField
                label="Samping"
                photo={item?.photoFruitSide}
                onPress={() => navigation.navigate(Routes.CAMERA_PHOTO, {
                  onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoFruitSide', photo),
                })}
                isRequired
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const Row = ({ children }: any) => (
  <View style={{ flexDirection: 'row' }}>
    <View style={{ marginRight: 5, flex: 1 }}>{React.Children.toArray(children)[0]}</View>
    <View style={{ marginLeft: 5, flex: 1 }}>{React.Children.toArray(children)[1]}</View>
  </View>
)

const PhotoField = ({ label, photo, onPress }: { label: string; photo: any; onPress: () => void; isRequired?: boolean }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ flex: 1, height: 100, borderRadius: 8, borderWidth: 1, borderColor: photo?.uri ? theme.colors.light2 : theme.colors.danger || 'red', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.light2 }}>
    {photo?.uri ? (
      <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    ) : (
      <>
        <Icon name="camera-alt" size={28} color={theme.colors.accent} />
        <Text size={11} style={{ marginTop: 4 }}>{label} *</Text>
      </>
    )}
  </TouchableOpacity>
)

export const calculateRipeFruit = (item: any) => {
  return (
    parseInt(item?.numberOfLength || '0') -
    (parseInt(item?.rawFruitChecked || '0') +
      parseInt(item?.lateRipeChecked || '0') +
      parseInt(item?.rottenFruitChecked || '0'))
    // +parseInt(item?.longHandleChecked || '0'))
  )
}

export default BPBKSForm
