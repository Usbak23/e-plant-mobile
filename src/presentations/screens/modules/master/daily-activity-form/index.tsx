import {useBlockOptions, useBlocksByDivisionStd, useSingleBlockById} from '@app/domain/states/block/hooks'
import {useDivisions, useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {useUomOptions} from '@app/domain/states/master/hooks'
import {actions, RootStateType} from '@app/domain/states/store'
import {useSubActivityOptions, useSubActivityOptionsCode} from '@app/domain/states/subactivity/hooks'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import IOption from '@app/models/commons/IOption'
import {IBlockRow} from '@app/models/eplant/Block'
import {IDailyActivity} from '@app/models/eplant/IDailyActivity'
import {IItemRow} from '@app/models/eplant/Item'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {theme} from '@app/presentations/utils/styles'
import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useNavigation, useRoute} from '@react-navigation/native'
import moment from 'moment'
import React, {useEffect, useRef, useState} from 'react'
import {useWatch} from 'react-hook-form'
import {useForm} from 'react-hook-form'
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import * as yup from 'yup'

const validationSchema = yup.object().shape({
  date: yup.string().required('Tanggal harus diisi').typeError('Tanggal harus diisi'),
  timeStart: yup.string().required('Waktu mulai harus diisi').typeError('Waktu mulai harus diisi'),
  timeEnd: yup.string().required('Waktu berakhir harus diisi').typeError('Waktu berakhir harus diisi dengan benar'),
  divisionId: yup.string(),
  blockId: yup.string(),
  subActivityId: yup.string().required('Kode Kegiatan wajib dipilih').typeError('Masukkan kode kegiatan dengan benar'),
  kmStart: yup
    .number()
    .nullable(true)
    .min(0, 'Minimal adalah 0 (nol)')
    .typeError('Masukkan Kilometer Awal dengan benar')
    .transform(value => (isNaN(value) || value === '' ? null : value)),
  kmEnd: yup
    .number()
    .nullable(true)
    .min(0, 'Minimal adalah 0 (nol)')
    .typeError('Masukkan Kilometer Akhir dengan benar')
    .transform(value => (isNaN(value) || value === '' ? null : value)),
  bbmBase: yup.number().required('BBM Base harus diisi').typeError('BBM Base harus diisi'),
  bbmTaken: yup
    .number()
    .nullable(true)
    .min(0, 'Minimum BBM diambil adalah 0')
    .typeError('Masukkan BBM yang diambil dengan benar')
    .transform(value => (isNaN(value) || value === '' ? null : value)),
  bbmUsed: yup
    .number()
    .nullable(true)
    .min(0, 'Minimum BBM dipakai adalah 0')
    .typeError('Masukkan BBM yang dipakai dengan benar')
    .transform(value => (isNaN(value) || value === '' ? null : value)),
  uomId: yup.string().required('Satuan Hasil Kerja harus diisi').typeError('Isi Hasil Kerja (Satuan) dengan Benar'),
  workResult: yup
    .number()
    .min(0, 'Hasil kerja minimum adalah 0')
    .required('Hasil kerja harus diisi')
    .typeError('Masukkan hasil kerja dengan benar'),
  oilSae: yup.string().typeError('Masukkan SAE dengan benar'),
  oilLiter: yup
    .number()
    .nullable(true)
    .min(0, 'Minimal adalah 0 (nol)')
    .typeError('Masukkan Liter dengan benar')
    .transform(value => (isNaN(value) || value === '' ? null : value)),
  description: yup.string().required('Keterangan harus diisi').typeError('Masukkan keterangan dengan benar'),
  driver: yup.string().required('Tulis nama supir').typeError('Masukkan nama supir dengan benar'),
})

const DailyActivityForm = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const user = useCurrentUserInfo()
  const item: IItemRow | undefined = route.params?.item
  const dailyActivity: IDailyActivity | undefined = route?.params?.dailyActivity
  const isEdit = dailyActivity != undefined
  const resolver = useYupValidationResolver(validationSchema)
  const divisions = useDivisionsByOrganization(item?.organization?.id)
  const subActivities = useSubActivityOptionsCode()
  const subs = useSubActivityOptions()
  const uoms = useUomOptions()

  const [selectedSubActivity, setSelectedSubActivity] = useState(isEdit ? dailyActivity?.subActivity?.id : '')

  const [selectedDivision, setSelectedDivision] = useState('')
  const blocks = useBlocksByDivisionStd(selectedDivision)
  const b = useSingleBlockById(dailyActivity?.block?.id || '')

  const {formDailyActivityStatus} = useSelector((state: RootStateType) => state.dailyActivityReducer)
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      date: isEdit ? moment(dailyActivity?.date).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
      timeStart: isEdit ? `${dailyActivity?.time.split('-')[0]}` : '',
      timeEnd: isEdit ? `${dailyActivity?.time.split('-')[1]}` : '',
      divisionId: '',
      blockId: isEdit ? dailyActivity?.block?.id : '',
      subActivityId: isEdit ? dailyActivity?.subActivity?.id : '',
      kmStart: isEdit
        ? dailyActivity?.kmStart != undefined && dailyActivity?.kmStart != null
          ? dailyActivity?.kmStart.toString()
          : ''
        : '',
      kmEnd: isEdit
        ? dailyActivity?.kmEnd != undefined && dailyActivity?.kmEnd != null
          ? dailyActivity?.kmEnd.toString()
          : ''
        : '',
      bbmBase: item?.bbmBase || 0,
      bbmTaken: isEdit
        ? dailyActivity?.bbmTaken != undefined && dailyActivity?.bbmTaken != null
          ? dailyActivity?.bbmTaken.toString()
          : ''
        : '',
      bbmUsed: isEdit
        ? dailyActivity?.bbmUsed != undefined && dailyActivity?.bbmUsed != null
          ? dailyActivity?.bbmUsed.toString()
          : ''
        : '',
      uomId: isEdit ? dailyActivity?.uom?.id : '',
      workResult: isEdit
        ? dailyActivity?.workResult != undefined && dailyActivity?.workResult != null
          ? dailyActivity?.workResult.toString()
          : ''
        : '',
      oilSae: isEdit ? (dailyActivity?.oilSae ? dailyActivity?.oilSae : '') : '',
      oilLiter: isEdit
        ? dailyActivity?.oilLiter != undefined && dailyActivity?.oilLiter != null
          ? dailyActivity?.oilLiter.toString()
          : ''
        : '',
      description: isEdit ? dailyActivity?.description : '',
      driver: isEdit ? dailyActivity?.driver : '',
    },
  })

  const kmStartWatcher = useWatch({
    control: control,
    name: 'kmStart',
    defaultValue: isEdit
      ? dailyActivity?.kmStart != undefined && dailyActivity?.kmStart != null
        ? dailyActivity?.kmStart.toString()
        : ''
      : '',
  })

  const kmEndWatcher = useWatch({
    control: control,
    name: 'kmEnd',
    defaultValue: isEdit
      ? dailyActivity?.kmEnd != undefined && dailyActivity?.kmEnd != null
        ? dailyActivity?.kmEnd.toString()
        : ''
      : '',
  })

  const onSubmit = (form: any) => {
    const start = parseInt(form.timeStart.replace(':', ''))
    const end = parseInt(form.timeEnd.replace(':', ''))
    if (start >= end) {
      showErrorToast('Waktu mulai harus lebih kecil dari waktu berakhir')
      return
    }
    if (form.kmStart == null && form.kmEnd != null) {
      setError(
        'kmStart',
        {
          type: 'string',
          message: 'Kilometer Awal tidak boleh kosong jika Kilometer Akhir terisi',
        },
        {
          shouldFocus: true,
        },
      )
      return
    }
    if (form.kmStart != null && form.kmEnd == null) {
      setError(
        'kmEnd',
        {
          type: 'string',
          message: 'Kilometer Akhir tidak boleh kosong jika Kilometer Awal terisi',
        },
        {
          shouldFocus: true,
        },
      )
      return
    }

    if (form.kmStart != null && form.kmEnd != null && form.kmStart > form.kmEnd) {
      setError(
        'kmStart',
        {
          type: 'string',
          message: 'Kilometer Awal tidak boleh melebihi Kilometer Akhir',
        },
        {
          shouldFocus: true,
        },
      )
      return
    }

    if (form.kmStart != null && form.kmEnd != null) {
      Object.assign(form, {
        kmCalculation: parseFloat((form.kmEnd - form.kmStart).toFixed(2)),
        bbmUsed:
          isNaN((form.kmEnd - form.kmStart) / form.bbmBase) || !isFinite((form.kmEnd - form.kmStart) / form.bbmBase)
            ? 0
            : parseFloat(((form.kmEnd - form.kmStart) / form.bbmBase).toFixed(2)),
      })
    }

    if (form.kmStart == null) {
      form.kmStart = 0
    }

    if (form.kmEnd == null) {
      form.kmEnd = 0
    }

    if (form.bbmTaken == null) {
      form.bbmTaken = 0
    }

    if (form.bbmUsed == null) {
      form.bbmUsed = 0
    }

    if (form.oilSae == null) {
      form.oilSae = 0
    }
    if (form.oilLiter == null) {
      form.oilLiter = 0
    }

    Object.assign(form, {
      time: `${form.timeStart}-${form.timeEnd}`,
      itemId: item?.id,
    })
    //

    if (!form.blockId || form.blockId == '') {
      delete form.blockId
    }

    if (isEdit) {
      Object.assign(form, {
        id: dailyActivity?.id,
      })

      dispatch(actions.editDailyActivity.request({loading: true, data: form}))
      return
    }
    dispatch(actions.createDailyActivity.request({loading: true, data: form}))
  }

  useEffect(() => {
    dispatch(actions.getUoms.request({loading: true}))
    dispatch(actions.clearFormDailyActivity())
  }, [])

  useEffect(() => {
    const error = formDailyActivityStatus?.error

    if (error) {
      showErrorToast(error.message)
    }
  }, [formDailyActivityStatus?.error])

  useEffect(() => {
    const data = formDailyActivityStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Perubahan disimpan')
      navigation.goBack()
    }
  }, [formDailyActivityStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Loader loading={Boolean(formDailyActivityStatus?.loading)} />
      <Header title={isEdit ? 'Ubah Aktivitas Harian' : 'Tambah Aktivitas Harian'} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentScroll}>
        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={getValues('date') || '-'}
            label="Tanggal Kegiatan"
            placeholder="Tanggal Kegiatan"
            control={control}
            name="date"
            isRequired
          />
        ) : (
          <DatePicker
            name="date"
            control={control}
            label="Tanggal"
            placeholder="Pilih Tanggal Kegiatan"
            errorText={errors?.date?.message}
            isRequired={true}
            onChangeText={value => {
              setValue('date', value, {
                shouldValidate: true,
              })
            }}
          />
        )}

        {isEdit ? (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'column', marginEnd: 8}}>
              <TextInput
                disabled={true}
                disabledText={getValues('timeStart') || '-'}
                label="Waktu Awal"
                placeholder="Waktu Awal Kegiatan"
                control={control}
                name="timeStart"
                isRequired
              />
            </View>
            <View style={{flex: 1, flexDirection: 'column', marginEnd: 8}}>
              <TextInput
                disabled={true}
                disabledText={getValues('timeEnd') || '-'}
                label="Waktu Akhir"
                placeholder="Waktu Akhir Kegiatan"
                control={control}
                name="timeEnd"
                isRequired
              />
            </View>
          </View>
        ) : (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'column', marginEnd: 8}}>
              <DatePicker
                style={{width: '50%'}}
                timeOnly
                name="timeStart"
                control={control}
                label="Waktu Awal"
                placeholder="Pilih Waktu Kegiatan"
                errorText={errors?.timeStart?.message}
                isRequired={true}
                onChangeText={function (value: string): void {
                  setValue('timeStart', value)
                }}
              />
            </View>

            <View style={{flex: 1, flexDirection: 'column', marginStart: 8}}>
              <DatePicker
                style={{width: '50%'}}
                timeOnly
                name="timeEnd"
                control={control}
                label="Waktu Akhir"
                placeholder="Pilih Waktu Kegiatan"
                errorText={errors?.timeEnd?.message}
                isRequired={true}
                onChangeText={function (value: string): void {
                  setValue('timeEnd', value)
                }}
              />
            </View>
          </View>
        )}

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={dailyActivity?.block?.division?.name || '-'}
            control={control}
            label="Divisi"
            placeholder="Pilih divisi"
            name="divisionId"
            errorText={errors.divisionId?.message}
          />
        ) : (
          <SelectInput
            items={divisions}
            control={control}
            label="Divisi"
            placeholder="Pilih divisi"
            name="divisionId"
            errorText={errors.divisionId?.message}
            onChange={v => {
              setSelectedDivision(v)
              setValue('blockId', '')
            }}
          />
        )}

        <TextInput
          isRequired
          control={control}
          label="Supir"
          placeholder="Ketik nama supir"
          name="driver"
          errorText={errors.driver?.message}
        />

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={b?.code || '-'}
            control={control}
            label="Blok"
            placeholder="Pilih blok"
            name="blockId"
            errorText={errors.blockId?.message}
          />
        ) : (
          <SelectInput
            items={blocks}
            control={control}
            label="Blok"
            placeholder="Pilih blok"
            name="blockId"
            errorText={errors.blockId?.message}
          />
        )}

        {/* <TextInput
          disabled={true}
          disabledText={user?.name || '-'}
          label="Karyawan"
          placeholder="Karyawan Pengaju"
          control={control}
          name="user"
          isRequired
        /> */}

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={dailyActivity?.subActivity?.accountNumber || '-'}
            control={control}
            label="Kode Kegiatan"
            placeholder="Pilih Kode Kegiatan"
            name="subActvityId"
            errorText={errors.subActivityId?.message}
          />
        ) : (
          <SelectInput
            isRequired={true}
            items={subActivities}
            control={control}
            label="Kode Kegiatan"
            placeholder="Pilih Kode Kegiatan"
            name="subActivityId"
            errorText={errors.subActivityId?.message}
            onChange={v => {
              setSelectedSubActivity(v)
              setValue('subActivityId', v)
            }}
          />
        )}

        <TextInput
          disabled={true}
          disabledText={(subs || []).find((v: IOption) => v.value == selectedSubActivity)?.label || '-'}
          label="Nama Kegiatan"
          placeholder="Nama Kegiatan"
          control={control}
          name="subActivityName"
          isRequired
        />

        <TextInput
          errorText={errors?.kmStart?.message}
          isNumber
          isFloat={true}
          label="Km Awal"
          placeholder="Contoh: 0"
          control={control}
          name="kmStart"
        />
        <TextInput
          errorText={errors?.kmEnd?.message}
          isNumber
          isFloat={true}
          label="Km Akhir"
          placeholder="Contoh: 10"
          control={control}
          name="kmEnd"
        />

        <TextInput
          disabled={true}
          disabledText={
            !isNaN(kmStartWatcher || 0) && !isNaN(kmEndWatcher)
              ? kmEndWatcher - kmStartWatcher < 0
                ? '-'
                : (kmEndWatcher - kmStartWatcher).toFixed(2) + ''
              : '-'
          }
          label="Kalkulasi Km"
          placeholder="Kalkulasi Km"
          control={control}
          name="calculatedKm"
          isRequired={false}
        />

        <TextInput
          disabled={true}
          disabledText={item?.bbmBase != undefined ? item?.bbmBase.toString() : '0'}
          label="Basis BBM (Km/Liter)"
          placeholder="Basis BBM"
          control={control}
          name="bbmBase"
          isRequired={false}
        />

        <TextInput
          isFloat={true}
          isNumber
          label="BBM Diambil (Liter)"
          placeholder="Contoh: 15"
          control={control}
          name="bbmTaken"
          errorText={errors?.bbmTaken?.message}
        />

        <TextInput
          disabled={true}
          disabledText={
            !isNaN(kmStartWatcher || 0) && !isNaN(kmEndWatcher)
              ? kmEndWatcher - kmStartWatcher < 0
                ? '-'
                : !isFinite(kmEndWatcher - kmStartWatcher / (item?.bbmBase || 0))
                ? '-'
                : parseFloat((kmEndWatcher - kmStartWatcher) / item?.bbmBase).toFixed(2) + ''
              : '-'
          }
          errorText={errors?.bbmUsed?.message}
          isNumber
          isFloat={true}
          label="Pemakaian BBM (liter)"
          placeholder="Contoh: 0"
          control={control}
          name="bbmUsed"
        />

        <TextInput
          disabled={true}
          disabledText={user?.name || '-'}
          label="Karyawan"
          placeholder="Karyawan Pengaju"
          control={control}
          name="user"
          isRequired
        />

        <SelectInput
          isRequired
          items={uoms}
          control={control}
          label="Hasil Kerja (Satuan)"
          placeholder="Pilih Satuan"
          name="uomId"
          errorText={errors.uomId?.message}
        />

        <TextInput
          label="Hasil Kerja (Volume)"
          placeholder="Contoh: 10"
          control={control}
          name="workResult"
          isRequired
          isNumber
          isFloat={true}
          errorText={errors.workResult?.message}
        />

        <TextInput
          label="Oli (SAE)"
          placeholder="Contoh: 30"
          control={control}
          name="oilSae"
          errorText={errors?.oilSae?.message}
          onChangeText={v => setValue('oilSae', v)}
        />
        <TextInput
          isNumber
          label="Oli (Liter)"
          placeholder="Contoh: 10"
          control={control}
          name="oilLiter"
          errorText={errors.oilLiter?.message}
        />
        <TextInput
          isRequired
          multiline
          maxLines={5}
          label="Keterangan"
          placeholder="Contoh: Body tidak ada kerusakan"
          control={control}
          name="description"
          errorText={errors.description?.message}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">Simpan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DailyActivityForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  contentScroll: {
    paddingBottom: 100,
  },
})
