import {IManagementWarehouse, IManagementWarehouseDetail} from '@app/models/eplant/WarehouseManagement'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useFieldArray} from 'react-hook-form'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {IRSWarehouseManagement} from '@app/domain/states/warehouse-management/reducer'
import {IRSRawMaterial} from '@app/domain/states/raw-material/reducer'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {INormMaterialMaterial, IRawMaterialRow} from '@app/models/eplant/RawMaterial'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {postBPUWarehouse} from '@app/domain/states/warehouse-management/actions'

const bpuSchema = yup.object().shape({
  blockId: yup.string().required('Blok wajib diisi').typeError('Isi Blok dengan benar'),
  kgPerPokok: yup
    .number()
    .min(0, 'Minimum adalah 0')
    .required('Kg/Pokok wajib diisi')
    .typeError('Isi Kg/Pokok dengan benar'),
  tonnage: yup.number().min(0, 'Minimum adalah 0').required('Tonase wajib diisi').typeError('Isi Tonase dengan benar'),
  kgPerUntil: yup
    .number()
    .min(0, 'Minimum adalah 0')
    .required('Kg/Until wajib diisi')
    .typeError('Isi Kg/Until dengan benar'),
})
const validationSchema = yup.object().shape({
  managementWarehouseId: yup.string().required('ID wajib diisi').typeError('Isi ID dengan benar'),
  bpus: yup.array().of(bpuSchema),
})

const WarehouseManagementBPU = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const item: IManagementWarehouse | undefined = route?.params?.item
  const parent = route?.params?.parent
  const resolver = useYupValidationResolver(validationSchema)

  const {warehouseDetail, formPostBPU}: IRSWarehouseManagement = useSelector(
    (state: RootStateType) => state?.warehouseReducer,
  )

  const {normMaterial}: IRSRawMaterial = useSelector((state: RootStateType) => state?.rawMaterial)

  const [itemDetail, setItemDetail] = useState<IManagementWarehouseDetail | undefined>(
    warehouseDetail?.data || undefined,
  )

  // const blocks = useBlocksByDivisionStd(parent?.division?.value)
  const blocks =
    warehouseDetail?.data?.request?.requestBlocks?.map(b => ({value: b?.block?.id, label: b?.block?.code})) || []
  const materials = normMaterial?.data?.material || []
  //TODO: unit atau unit/pokok
  const kgPokok =
    materials?.find((mat: INormMaterialMaterial) => mat?.rawMaterial?.id == itemDetail?.material?.id)?.unitPokok || '-'

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      managementWarehouseId: item?.id,
      bpus: [],
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    //@ts-ignore
    name: 'bpus',
  })

  const isHaveBpuNaming = () => {
    if (itemDetail?.bpus && itemDetail?.bpus?.length > 0) {
      return 'Ubah Untilan'
    } else if (itemDetail?.bpus && itemDetail?.bpus?.length === 0) {
      return 'Tambah Untilan'
    }
    return 'Tambah Untilan'
  }

  useEffect(() => {
    dispatch(actions.getWarehouseDetail.request({loading: true, data: item?.id}))
    dispatch(
      actions.getNormMaterialList.request({
        loading: true,
        data: {
          organizationId: parent?.organization?.value,
          year: parent?.year,
        },
      }),
    )
  }, [])

  useEffect(() => {
    if (warehouseDetail?.data) {
      const bpus =
        warehouseDetail?.data?.bpus?.map((bpu: any) => {
          return {
            blockId: bpu.block?.id,
            kgPerPokok: bpu.kgPerPokok.toString(),
            tonnage: bpu.tonnage.toString(),
            kgPerUntil: bpu.kgPerUntil.toString(),
          }
        }) || []
      reset({
        managementWarehouseId: item?.id,
        bpus: bpus,
      })
      setItemDetail(warehouseDetail?.data)
    }
  }, [warehouseDetail?.data])

  useEffect(() => {
    const error = formPostBPU?.error
    if (error) {
      const msg = 'Gagal menyimpan untilan'
      showErrorToast(msg)
    }
  }, [formPostBPU?.error])

  useEffect(() => {
    const data = formPostBPU?.data
    if (data?.data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
      navigation.goBack()
    }
  }, [formPostBPU?.data])

  const onSubmit = (form: any) => {
    const bpus = form.bpus || []
    //check block duplicate
    for (let i = 0; i < bpus.length; i++) {
      for (let j = i + 1; j < bpus.length; j++) {
        if (bpus[i].blockId == bpus[j].blockId) {
          showErrorToast('Terdapat blok yang sama. Harap pilih salah satu.')
          return
        }
      }
    }

    dispatch(actions.postBPUWarehouse.request({loading: true, data: form}))
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isHaveBpuNaming()} />
      <Loader loading={Boolean(warehouseDetail?.loading) || Boolean(normMaterial?.loading)} />

      {kgPokok == '-' ? (
        <View style={{margin: 16, alignItems: 'center'}}>
          <Text color={theme.colors.textThinBlack} style={{textAlign: 'center'}}>
            Material ini belum ada di norma basis. Tambahkan terlebih dahulu untuk dapat mengisi untilan
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom: 86}} style={styles.scroll}>
          <TextInput
            disabled={true}
            disabledText={item?.name || '-'}
            label="Nama Pupuk"
            control={undefined}
            name={'name'}
          />
          <TextInput
            disabled={true}
            disabledText={moment(item?.date).format('DD MMMM YYYY').toString() || '-'}
            label="Tanggal Permintaan"
            control={undefined}
            name={'date'}
          />

          {/* <TextInput disabled={true} disabledText={'2'} label="Kg/Pokok" control={undefined} name={'date'} /> */}
          <View style={{marginVertical: 8}} />

          {fields.map((bpu: any, index: number) => {
            return (
              <View
                key={bpu?.id}
                style={{backgroundColor: theme.colors.lightGrey, padding: 16, borderRadius: 16, marginVertical: 8}}>
                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => {
                    remove(index)
                  }}>
                  <MaterialCommunityIcons name="delete-outline" size={24} />
                </TouchableOpacity>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <SelectInput
                      isRequired
                      items={blocks}
                      control={control}
                      label="Blok"
                      name={`bpus.[${index}].blockId`}
                      errorText={errors?.[`bpus[${index}].blockId`]?.message}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      isRequired
                      disabled={true}
                      disabledText={kgPokok.toString() || '-'}
                      label="Kg/Pokok"
                      control={control}
                      name={`bpus.[${index}].kgPerPokok`}
                      errorText={errors?.[`bpus[${index}].kgPerPokok`]?.message}
                    />
                  </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      isNumber
                      isFloat={true}
                      isRequired
                      control={control}
                      label="Tonase"
                      placeholder="Contoh: 1"
                      name={`bpus.[${index}].tonnage`}
                      errorText={errors?.[`bpus[${index}].tonnage`]?.message}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      isNumber
                      isFloat={true}
                      isRequired
                      label="Kg Until"
                      placeholder="Contoh: 1"
                      control={control}
                      name={`bpus.[${index}].kgPerUntil`}
                      errorText={errors?.[`bpus[${index}].kgPerUntil`]?.message}
                    />
                  </View>
                </View>
              </View>
            )
          })}

          <View style={{width: '50%'}}>
            <Button
              onPress={() => {
                append({
                  blockId: '',
                  kgPerPokok: kgPokok || 0,
                  tonnage: '',
                  kgPerUntil: '',
                })
              }}>
              <Text size={11} type="semibold" color={theme.colors.white}>
                Tambah Blok
              </Text>
            </Button>
          </View>

          <View style={{marginTop: 16}} />

          <Button onPress={handleSubmit(onSubmit)}>
            <Text color={theme.colors.white}>Simpan</Text>
          </Button>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default WarehouseManagementBPU

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
})
