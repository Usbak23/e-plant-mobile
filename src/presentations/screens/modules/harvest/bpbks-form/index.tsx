import { theme } from '@app/presentations/utils/styles'
import { Button, Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
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
      numberOfLength: item?.tph[0]?.numberOfLength?.toString(),
      loose: item?.tph[0]?.loose?.toString(),
      ripeFruitChecked: item?.tph[0]?.ripeFruitChecked?.toString(),
      rawFruitChecked: item?.tph[0]?.rawFruitChecked?.toString(),
      lateRipeChecked: item?.tph[0]?.lateRipeChecked?.toString(),
      rottenFruitChecked: item?.tph[0]?.rottenFruitChecked?.toString(),
      longHandleChecked: item?.tph[0]?.longHandleChecked?.toString(),
      looseChecked: item?.tph[0]?.looseChecked?.toString(),
      plantingYear: item?.tph[0]?.plantingYear != undefined ? item.tph[0].plantingYear.toString() : '2012'
    },
  })

  const [selectedUser, setSelectedUser] = useState(item?.harvester?.id || item?.harvesterId || '')
  const [defaultTph, setDefaultTph] = useState([])
  const [draftOptions, setDraftOptions] = useState<ITonnageGardenDraftOption[]>([])
  const [selectedGardenTonnageId, setSelectedGardenTonnageId] = useState<string>('')
  const [tphForm, setTphForm] = useState([
    {
      blockId: item?.tph?.block?.id || item?.blockId,
      plantingYear: item?.plantingYear,
      tphId: item?.tph?.id || item?.tphId,
      numberOfLength: item?.numberOfLength?.toString(),
      ripeFruitChecked: item?.ripeFruitChecked?.toString(),
      rawFruitChecked: item?.rawFruitChecked?.toString(),
      lateRipeChecked: item?.lateRipeChecked?.toString(),
      rottenFruitChecked: item?.rottenFruitChecked?.toString(),
      longHandleChecked: item?.longHandleChecked?.toString(),
      looseChecked: item?.looseChecked?.toString(),
    },
  ])

  const formBPBKSStatus = useSelector((state: RootStateType) => state.bpbks.formBPBKSStatus)
  const userAll = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  const tphAll = useSelector((state: RootStateType) => {
    return state.tph?.tphAll?.data || []
  })
  const user = userAll.find(e => e.id === selectedUser)
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  const users = useUsersByDivision(bpbksData?.division?.id)
  const blocks = useBlocksWithPlantingYearByDivisionStd(bpbksData?.division?.id)

  useEffect(() => {
    if (!isEdit && bpbksData?.organization?.value && bpbksData?.date) {
      System.instance.tonnageGarderService.getDraftOptions({
        organizationId: bpbksData.organization.value,
        date: moment(bpbksData.date).format('YYYY-MM-DD'),
      }).then((res: any) => {
        setDraftOptions(res?.data?.response || [])
      }).catch(() => setDraftOptions([]))
    }
  }, [bpbksData?.organization?.value, bpbksData?.date])

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
        return a.blockId == arr[i].blockId && a?.plantingYear == arr[i]?.plantingYear && j != i
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
      showErrorToast('Tidak boleh ada Blok dan Tahun Tanam yang sama!')
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
    if (!validateTPH()) {
      return
    }
    if (isEdit) {
      const requestBody = constructToFormDataUpdate(value)
      dispatch(actions.editBPBKS.request({ loading: true, data: requestBody }))
      return
    }

    const requestBodyCreate = constructToFormDataCreate(value)
    try {
      const res: any = await System.instance.bpbksService.createBPBKS(requestBodyCreate)
      const createdTphs = res?.data?.response?.tphs || []
      const allTphs = [...defaultTph, ...tphForm]
      for (let i = 0; i < allTphs.length; i++) {
        const tph = allTphs[i] as any
        const createdTph = createdTphs[i]
        if (createdTph?.id && (tph.photoFruit || tph.photoKrani)) {
          await System.instance.bpbksService.uploadPhotos(createdTph.id, tph.photoFruit, tph.photoKrani)
        }
      }
      showSuccessToast('Berhasil disimpan')
      navigation.goBack()
    } catch (e: any) {
      showErrorToast(e?.response?.data?.message?.id || 'Gagal menyimpan')
    }
  }

  const setFieldTphForm = (index: number, field: any, value: any) => {
    const newTphForm = tphForm.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    setTphForm(newTphForm)
  }

  useEffect(() => {
    dispatch(actions.clearFormBPBKSStatus())
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getTPHAll.request({ loading: true }))
    dispatch(actions.getAllBlock.request({ loading: true }))
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

  const HeaderView = () => <Header title={isEdit ? 'Ubah PMB' : 'Tambah PMB'} />

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
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
            placeholder="Contoh : Dedi"
            control={control}
            items={users}
            disabled={isEdit}
            disabledText={item?.harvester?.name || user?.name}
            name="harvesterId"
            onChange={v => setSelectedUser(v)}
            isRequired
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
        {!isEdit && draftOptions.length > 0 && (
          <SelectInput
            label="No. Kendaraan (Tonase Draft)"
            placeholder="Pilih kendaraan dari tonase draft"
            control={control}
            name="gardenTonnageId"
            items={draftOptions.map(d => ({
              value: d.id,
              label: d.item ? `${d.item.name} - ${d.item.serialNumber}` : d.id,
            }))}
            onChange={(v: string) => setSelectedGardenTonnageId(v)}
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
                      numberOfLength: '',
                      ripeFruitChecked: '',
                      rawFruitChecked: '',
                      lateRipeChecked: '',
                      rottenFruitChecked: '',
                      longHandleChecked: '',
                      looseChecked: '',
                      photoFruit: null,
                      photoKrani: null,
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
          disabled={item?.viewOnly || isEdit}
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
          disabled={item?.viewOnly}
          disabledText={item?.plantingYear}
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
          disabled={item?.viewOnly}
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
            item?.ripeFruitChecked?.length === 0
              ? 'Buah Matang (Janjang)'
              : item?.ripeFruitChecked < 0
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
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
          <PhotoField
            label="Foto Buah"
            photo={item?.photoFruit}
            onPress={() => {
              navigation.navigate(Routes.CAMERA_PHOTO, {
                onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoFruit', photo),
              })
            }}
          />
          <PhotoField
            label="Foto Krani"
            photo={item?.photoKrani}
            onPress={() => {
              navigation.navigate(Routes.CAMERA_PHOTO, {
                onPhotoCaptured: (photo: any) => setFieldTphForm(index, 'photoKrani', photo),
              })
            }}
          />
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

const PhotoField = ({ label, photo, onPress }: { label: string; photo: any; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ flex: 1, height: 100, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.light2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.light2 }}>
    {photo?.uri ? (
      <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    ) : (
      <>
        <Icon name="camera-alt" size={28} color={theme.colors.accent} />
        <Text size={11} style={{ marginTop: 4 }}>{label}</Text>
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
