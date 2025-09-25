import {theme} from '@app/presentations/utils/styles'
import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {
  IRealizationFertilizationRKT,
  IRealizationFertilizationRKTMaterial,
  IRealizationFertilizationRow,
} from '@app/models/eplant/RealizationFertilization'
import {useBlocksByDivisionFull, useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import {IBlockRow} from '@app/models/eplant/Block'
import {useWatch} from 'react-hook-form'
import {IRSRealizationFertilization} from '@app/domain/states/realization-fertilization/reducer'
import {actions, RootStateType} from '@app/domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {action} from 'typesafe-actions'
import moment from 'moment'

const validationSchema = yup.object().shape({
  rktId: yup.string().required('RKT wajib dipilih'),
  materialId: yup.string().required('Material wajib dipilih'),
  blockId: yup.string().required('Blok wajib dipilih'),
  rotation: yup
    .number()
    .min(0, 'Rotasi tidak boleh negatif')
    .required('Rotasi wajib diisi')
    .typeError('Masukkan rotasi dengan benar'),
  date: yup.string().required('Tanggal wajib diisi'),
  realizationKgPerPokok: yup
    .number()
    .min(0, 'Realisasi Kg/Pokok tidak boleh negatif')
    .required('Realisasi Kg/Pokok wajib diisi')
    .typeError('Masukkan realisasi kg/pokok dengan benar'),
  realizationTonnage: yup
    .number()
    .min(0, 'Realisasi Tonase tidak boleh negatif')
    .required('Realisasi Tonase wajib diisi')
    .typeError('Masukkan realisasi tonase dengan benar'),
})

const RealizationFertilizationForm = () => {
  const route: any = useRoute()
  const parent = route?.params?.parent
  const isEdit: boolean = Boolean(route?.params?.isEdit)
  const item: IRealizationFertilizationRow | undefined = route?.params?.item
  const rkt: IRealizationFertilizationRKT | undefined = route?.params?.rkt
  const selectedSubActivity: {id: string; name: string} = route?.params?.selectedSubActivity
  const selectedMaterial: {id: string; name: string} = route?.params?.selectedMaterial
  const dispatch = useDispatch()
  const navigation: any = useNavigation()

  const resolver = useYupValidationResolver(validationSchema)

  const blocks = useBlocksByDivisionFull(rkt?.division?.id)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      rktId: rkt?.id,
      materialId: selectedMaterial?.id,
      blockId: isEdit ? item?.block?.id : '',
      rotation: isEdit ? item?.rotation.toString() : '',
      date: isEdit ? moment(item?.date).format('YYYY-MM-DD') : '',
      realizationKgPerPokok: isEdit ? item?.realizationKgPerPokok.toString() : '',
      realizationTonnage: isEdit ? item?.realizationTonnage.toString() : '',
    },
  })

  const blockWatcher = useWatch({
    control: control,
    name: 'blockId',
    defaultValue: control._defaultValues.blockId || '',
  })

  const realizationTonnageWatcher = useWatch({
    control: control,
    name: 'realizationTonnage',
    defaultValue: control._defaultValues.realizationTonnage || '',
  })

  const rktMaterials = rkt?.rktActivities?.material || []
  const rotation =
    rktMaterials?.find((m: IRealizationFertilizationRKTMaterial) => {
      return m.rawMaterial?.id === selectedMaterial?.id && m.block?.id == blockWatcher
    })?.rotation || 0

  const generateRotation = () => {
    const rts: {label: string; value: string}[] = []
    for (let i = 1; i <= rotation; i++) {
      rts.push({value: i.toString(), label: i.toString()})
    }
    return rts
  }

  const onSubmit = (form: any) => {
    if (isEdit) {
      Object.assign(form, {id: item?.id, rktId: rkt?.id})
      if(form.realizationTonnage != undefined && form.realizationTonnage != null && form.realizationTonnage != ''){
        form.realizationTonnage = parseFloat(form.realizationTonnage.toFixed(2))
      }

      dispatch(actions.updateRealizationFertilization.request({loading: true, data: form}))
      return
    }
    dispatch(actions.createRealizationFertilization.request({loading: true, data: form}))
  }

  const {formCreateUpdateRealizationFertilization}: IRSRealizationFertilization = useSelector(
    (state: RootStateType) => state?.realizationFertilizationReducer || {},
  )

  useEffect(() => {
    const error = formCreateUpdateRealizationFertilization?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formCreateUpdateRealizationFertilization?.error])

  useEffect(() => {
    const data = formCreateUpdateRealizationFertilization?.data
    if (data?.data?.status == 'success') {
      showSuccessToast('Perubahan disimpan.')
      navigation.goBack()
    }
  }, [formCreateUpdateRealizationFertilization?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Realisasi' : 'Tambah Realisasi'} />
      <Loader loading={Boolean(formCreateUpdateRealizationFertilization?.loading)} />
      <ScrollView contentContainerStyle={{paddingBottom: 86}} style={styles.scrollView}>
        <TextInput
          label="Jenis Pupuk"
          control={control}
          name="materialId"
          disabled
          disabledText={selectedMaterial?.name || '-'}
          isRequired
        />
        <TextInput
          label="Sub Aktivitas"
          control={control}
          name="subActivityId"
          disabled
          disabledText={selectedSubActivity?.name || '-'}
          isRequired
        />
        {isEdit ? (
          <TextInput
            label="Blok"
            control={control}
            name="blockId"
            disabled
            disabledText={item?.block?.code || '-'}
            isRequired
          />
        ) : (
          <SelectInput
            label="Blok"
            isRequired
            errorText={errors?.blockId?.message}
            control={control}
            name={'blockId'}
            placeholder="Pilih blok"
            items={blocks?.map((b: IBlockRow) => ({value: b.id, label: b.code})) || []}
            onChange={v => {
              setValue('rotation', '')
              if (!isNaN(getValues('realizationKgPerPokok'))) {
                const num = parseFloat(getValues('realizationKgPerPokok'))
                setValue('realizationTonnage', num * blocks.find((b: IBlockRow) => b.id === v)?.totalTree || 0)
              }
            }}
          />
        )}

        <View style={{marginBottom: 8}}>
          <Text
            color={theme.colors.label}
            type="bold"
            size={12}
            style={{
              color: theme.colors.textThinBlack,
              marginBottom: 6,
            }}>
            Tahun Tanam
          </Text>
          {blockWatcher == '' ? (
            <Text>-</Text>
          ) : (
            <>
              <Text> {blocks.find((b: IBlockRow) => b.id === blockWatcher)?.plantingYear?.join(', ') || '-'}</Text>
            </>
          )}
        </View>

        <TextInput
          label="Ha"
          control={control}
          name="ha"
          disabled
          disabledText={blocks.find((b: IBlockRow) => b.id === blockWatcher)?.blockArea || '-'}
          isRequired
        />

        <TextInput
          label="Pokok"
          control={control}
          name="pokok"
          disabled
          disabledText={blocks.find((b: IBlockRow) => b.id === blockWatcher)?.totalTree || '-'}
          isRequired
        />

        <TextInput
          label="SPH"
          control={control}
          name="sph"
          disabled
          disabledText={
            isNaN(
              blocks.find((b: IBlockRow) => b.id === blockWatcher)?.totalTree /
                blocks.find((b: IBlockRow) => b.id === blockWatcher)?.blockArea,
            )
              ? '-'
              : (
                  blocks.find((b: IBlockRow) => b.id === blockWatcher)?.totalTree /
                  blocks.find((b: IBlockRow) => b.id === blockWatcher)?.blockArea
                ).toFixed(2)
          }
          isRequired
        />

        <View style={{marginVertical: 8}}>
          <Text
            color={theme.colors.label}
            type="bold"
            size={12}
            style={{
              color: theme.colors.textThinBlack,
              marginBottom: 6,
            }}>
            Varietas
          </Text>
          {blockWatcher == '' ? (
            <Text>-</Text>
          ) : (
            <>
              <Text> {blocks.find((b: IBlockRow) => b.id === blockWatcher)?.varieties?.join(', ') || '-'}</Text>
            </>
          )}
        </View>
        {isEdit ? (
          <TextInput
            label="Rotasi"
            control={control}
            name="rotation"
            disabled
            disabledText={item?.rotation || '-'}
            isRequired
          />
        ) : (
          <SelectInput
            label="Rotasi"
            isRequired
            errorText={errors?.rotation?.message}
            control={control}
            name={'rotation'}
            placeholder="Pilih rotasi"
            items={generateRotation()}
          />
        )}

        <DatePicker
          minimumDate={new Date(`${parent?.year}-01-01`)}
          maximumDate={new Date(`${parent?.year}-12-31`)}
          name="date"
          control={control}
          label="Tanggal Aplikasi"
          placeholder="Pilih tanggal"
          errorText={errors?.date?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('date', value, {
              shouldValidate: true,
            })
          }}
        />

        <TextInput
          isNumber
          placeholder="Contoh: 2"
          isFloat={true}
          label="Realisasi Kg/Pokok"
          control={control}
          name="realizationKgPerPokok"
          errorText={errors?.realizationKgPerPokok?.message}
          isRequired
          onChangeText={v => {
            if (v === '') {
              setValue('realizationTonnage', '')
            } else {
              const num = parseFloat(v)
              setValue('realizationTonnage', num * blocks.find((b: IBlockRow) => b.id === blockWatcher)?.totalTree || 0)
            }
          }}
        />

        <TextInput
          disabled
          disabledText={realizationTonnageWatcher != '' && realizationTonnageWatcher != undefined && realizationTonnageWatcher != null ? parseFloat(realizationTonnageWatcher).toFixed(2): ''}
          isNumber
          placeholder="Contoh: 2"
          isFloat={true}
          label="Realisasi Tonase"
          control={control}
          name="realizationTonnage"
          errorText={errors?.realizationTonnage?.message}
          isRequired
        />

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color={theme.colors.white}>Simpan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RealizationFertilizationForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: 16,
  },
})
