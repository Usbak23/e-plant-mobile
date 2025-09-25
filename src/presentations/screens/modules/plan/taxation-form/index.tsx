import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import React, {useEffect} from 'react'
import {Keyboard, SafeAreaView, ScrollView, View} from 'react-native'
import {styles} from './style'
import * as schema from '@utils/validation/taxation-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import {CalculationReferences, ITaxationRow} from '@app/models/eplant/Taxation'
import {dateFormatter} from '@app/presentations/utils/dateFormatter'
import {useUserDataCredential} from '@app/domain/states/user/hooks'
import IOption from '@app/models/commons/IOption'
import {useWatch} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {actions, RootStateType} from '@domain/states/store'

const TaxationForm = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item: ITaxationRow | undefined = route?.params?.item
  const isEdit = Boolean(item?.isHaveTaksasi)
  const resolver = useYupValidationResolver(schema.taxationValidationSchema)

  const userData = useUserDataCredential()
  const {formTaxationStatus} = useSelector((state: RootStateType) => state?.taxation)

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
      id: item?.taxation?.id,
      akpId: item?.id,
      harvestChapel: isEdit ? item?.taxation?.harvestChapel : item?.block?.harvestChapel,
      akpPercent: isEdit ? item?.taxation?.akpPercent?.toString() : item?.akpPercent?.toString(),
      sph: isEdit ? item?.taxation?.sph.toString() : item?.sph?.toString(),
      totalHectares: item?.block?.blockArea || '',
      hectareRestOfToday: isEdit ? item?.taxation?.hectareRestOfToday.toString() : '',
      hectareRestOfTommorow: '',
      ripeFruit: isNaN(
        (parseFloat(item.akpPercent.toString()) / 100) * parseFloat(item?.sph) * parseFloat(item?.block?.blockArea),
      )
        ? '0'
        : (
            (parseFloat(item.akpPercent.toString()) / 100) *
            parseFloat(item?.sph) *
            parseFloat(item?.block?.blockArea)
          ).toFixed(2),
      bjr: isEdit ? item?.taxation?.bjr.toString() : '',
      kilogram: isEdit ? item?.taxation?.kilogram : '',
      calculationReference: isEdit ? item?.taxation?.calculationReference : '',
      numberOfEmployees: isEdit ? item?.taxation?.numberOfEmployees.toString() : '',
      kilogramPerHk: isEdit ? item?.taxation?.kilogramPerHk.toFixed(2).toString() : '',
      date: isEdit ? item?.taxation?.date : '',
      haRealization: '',
    },
  })

  const haRealizationWatcher = useWatch({
    control: control,
    name: 'haRealization',
    defaultValue: control._defaultValues.haRealization || '',
  })

  const dateTaxationWatcher = useWatch({
    control: control,
    name: 'date',
    defaultValue: control._defaultValues.date || '',
  })

  const calcReferenceWatcher = useWatch({
    control: control,
    name: 'calculationReference',
    defaultValue: control._defaultValues.calculationReference || '',
  })

  const haTomorrowWatcher = useWatch({
    control: control,
    name: 'hectareRestOfTommorow',
    defaultValue: control._defaultValues.hectareRestOfTomorrow || '',
  })

  const kilogramWatcher = useWatch({
    control: control,
    name: 'kilogram',
    defaultValue: control._defaultValues.kilogram || '',
  })

  const kilogramPerHkWatcher = useWatch({
    control: control,
    name: 'kilogramPerHk',
    defaultValue: control._defaultValues.kilogramPerHk || '',
  })

  const numberOfEmployeesWatcher = useWatch({
    control: control,
    name: 'numberOfEmployees',
    defaultValue: control._defaultValues.numberOfEmployees || '',
  })

  const getUserInfo = () => {
    if (isEdit) {
      const nip = item?.taxation?.user?.nip
      const name = item?.taxation?.user?.name
      const roleName = item?.taxation?.user?.role?.name
      return `${nip} - ${name} - ${roleName}`
    }
    const name = userData?.data?.name || '?'
    const nip = userData?.data?.data?.nip || '?'
    return `${nip} - ${name}`
  }

  const calculateKilogram = (ripeFruit?: string, bjr?: string) => {
    const ripeFruitAsNumber = ripeFruit ? parseFloat(ripeFruit) : parseFloat(getValues('ripeFruit'))
    const bjrAsNumber = bjr ? parseFloat(bjr) : parseFloat(getValues('bjr'))

    if (isNaN(ripeFruitAsNumber) || isNaN(bjrAsNumber)) {
      setValue('kilogram', '', {shouldValidate: true})
      setValue('kilogramPerHk', '', {shouldValidate: true})
      setValue('numberOfEmployees', '', {shouldValidate: true})
    } else {
      const kg = ripeFruitAsNumber * bjrAsNumber
      if (!isNaN(kg)) {
        setValue('kilogram', kg.toFixed(2), {shouldValidate: true})
        if (
          getValues('calculationReference') == 'Jumlah Karyawan' ||
          getValues('calculationReference') == 'Jumlah HK'
        ) {
          const v = kg / getValues('numberOfEmployees')

          if (v && v != 0 && isFinite(v)) {
            setValue('kilogramPerHk', v, {shouldValidate: true})
          } else {
            setValue('kilogramPerHk', '', {shouldValidate: true})
          }
        } else if (getValues('calculationReference') == 'Kilogram/HK') {
          const v = kg / getValues('kilogramPerHk')
          if (v && v != 0 && isFinite(v)) {
            setValue('numberOfEmployees', parseFloat(v).toFixed(2), {shouldValidate: true})
          } else {
            setValue('numberOfEmployees', '', {shouldValidate: true})
          }
        }
        return
      }
      setValue('kilogram', '', {shouldValidate: true})
      setValue('kilogramPerHk', '', {shouldValidate: true})
      setValue('numberOfEmployees', '', {shouldValidate: true})
    }
  }

  const calculateRipeFruit = (totalHa?: string) => {
    const totalHaAsNumber = totalHa ? parseFloat(totalHa) : parseFloat(getValues('totalHectares'))
    const akpPercentAsNumber = item?.akpPercent ? parseFloat(item.akpPercent.toString()) : parseFloat('')
    const sphAsNumber = item?.sph != undefined ? parseFloat(item.sph.toString()) : parseFloat('')

    if (isNaN(totalHaAsNumber) || isNaN(akpPercentAsNumber) || isNaN(sphAsNumber)) {
      setValue('ripeFruit', '', {shouldValidate: true})
      setValue('kilogram', '', {shouldValidate: true})
      setValue('kilogramPerHk', '', {shouldValidate: true})
      setValue('numberOfEmployees', '', {shouldValidate: true})
    } else {
      const ripe = (akpPercentAsNumber / 100) * sphAsNumber * totalHaAsNumber
      if (!isNaN(ripe)) {
        setValue('ripeFruit', ripe.toFixed(2), {shouldValidate: true})
        calculateKilogram(ripe.toString())
        return
      }
      setValue('ripeFruit', '', {shouldValidate: true})
      setValue('kilogram', '', {shouldValidate: true})
      setValue('kilogramPerHk', '', {shouldValidate: true})
      setValue('numberOfEmployees', '', {shouldValidate: true})
    }
  }

  const calculateKilogramPerHk = (totalEmployees?: string) => {
    const totalEmployeesAsNumber = totalEmployees
      ? parseFloat(totalEmployees)
      : parseFloat(getValues('numberOfEmployees'))
    const kilogram = parseFloat(getValues('kilogram')) || parseFloat('')

    if (isNaN(totalEmployeesAsNumber) || isNaN(kilogram)) {
      setValue('kilogramPerHk', '', {shouldValidate: true})
    } else {
      const kgPerHk = kilogram / totalEmployeesAsNumber
      if (kgPerHk || kgPerHk == 0) {
        setValue('kilogramPerHk', kgPerHk.toFixed(2), {shouldValidate: true})
        return
      }
      setValue('kilogramPerHk', '', {shouldValidate: true})
    }
  }

  const calculateHaEsokHari = (haHariIni: string) => {
    const haHariIniNum =
      haHariIni == '' || haHariIni == undefined || isNaN(parseFloat(haHariIni))
        ? parseFloat('0')
        : parseFloat(haHariIni)
    const haRealized = isNaN(parseFloat(haRealizationWatcher)) ? 0 : parseFloat(haRealizationWatcher)
    const haEsokHari = parseFloat(getValues('totalHectares')) - haRealized - haHariIniNum
    if (isNaN(haEsokHari) || haEsokHari < 0) {
      showErrorToast('Ha Esok Hari tak boleh melebihi sisa Ha yang belum terealisasi')
      setValue('hectareRestOfTommorow', 0, {shouldValidate: true})
      setValue('hectareRestOfToday', 0, {shouldValidate: true})
      return
    }
    setValue('hectareRestOfTommorow', haEsokHari.toFixed(2), {shouldValidate: true})
  }

  const calculateNumberofEmployeesPerHk = (kgPerHk?: string) => {
    const kg = kgPerHk ? parseFloat(kgPerHk) : parseFloat(getValues('kilogramPerHk'))
    const kilogram = parseFloat(getValues('kilogram')) || parseFloat('')

    if (isNaN(kg) || isNaN(kilogram)) {
      setValue('numberOfEmployees', '', {shouldValidate: true})
    } else {
      const numberOfEmployees = parseFloat((kilogram / kg).toFixed(2).toString())
      if ((numberOfEmployees || numberOfEmployees == 0) && isFinite(numberOfEmployees)) {
        setValue('numberOfEmployees', numberOfEmployees, {shouldValidate: true})
        return
      }
      setValue('numberOfEmployees', '', {shouldValidate: true})
    }
  }

  const submitTaxation = (form: any) => {
    const unrealizedHa = form.totalHectares - form.haRealization
    if (unrealizedHa < form.hectareRestOfToday) {
      showErrorToast('Ha yang belum terealisasi tidak boleh kurang dari ha esok hari')
      return
    }

    if (isEdit) {
      dispatch(actions.editTaxation.request({loading: true, data: form}))
      return
    }
    dispatch(actions.createTaxation.request({loading: true, data: form}))
  }

  const hax = useSelector((state: RootStateType) => state.taxation?.taxationHaRealization)

  useEffect(() => {
    if (item?.id && getValues('date')) {
      dispatch(
        actions.getHaRealizationTaxation.request({loading: true, data: {date: getValues('date'), akpId: item?.id}}),
      )
    }
  }, [item?.id, dateTaxationWatcher])

  useEffect(() => {
    calculateHaEsokHari(getValues('hectareRestOfToday'))
  }, [haRealizationWatcher])

  useEffect(() => {
    const error = hax?.error
    if (error) {
      showErrorToast('Gagal mendapatkan data ha realisasi. Pastikan internet anda memadai dan coba lagi')
      setValue('haRealization', '', {shouldValidate: true})
    }
  }, [hax?.error])

  useEffect(() => {
    const data = hax?.data?.haRealization
    if (data != undefined) {
      const val = getValues('date') == '' ? 0 : data
      setValue('haRealization', val, {shouldValidate: true})
    }
  }, [hax?.data])

  useEffect(() => {
    const error = formTaxationStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formTaxationStatus?.error])

  useEffect(() => {
    const data = formTaxationStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast(`${isEdit ? 'Berhasil diperbarui' : 'Berhasil disimpan'}`)
      navigation.goBack()
    }
  }, [formTaxationStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Taksasi' : 'Lengkapi Taksasi'} />
      <Loader loading={Boolean(formTaxationStatus?.loading) || Boolean(hax?.loading)} />
      {/* <View style={[styles.container, styles.contentContainer]}> */}
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Button style={{marginBottom: 26}} onPress={handleSubmit(submitTaxation)}>
          <Text color="white">{isEdit ? 'Ubah Taksasi' : 'Lengkapi Taksasi'}</Text>
        </Button>

        <TextInput
          disabledText={item?.block?.division?.organization?.name || '-'}
          disabled
          control={{}}
          label="Organisasi"
          name="organization"
          isRequired
        />

        <TextInput
          disabledText={item?.block?.division?.name || '-'}
          disabled
          control={{}}
          label="Division"
          name="division"
          isRequired
        />

        <TextInput disabledText={item?.block?.code || '-'} disabled control={{}} label="Blok" name="block" isRequired />

        <TextInput
          disabledText={`${control._defaultValues.akpPercent}%`}
          disabled
          control={{}}
          label="% AKP"
          name="akp"
          isRequired
        />

        <TextInput
          disabledText={dateFormatter(item?.harvestDate)}
          disabled
          control={{}}
          label="Tanggal Panen"
          name="harvestDate"
          isRequired
        />

        <TextInput disabledText={item?.sph?.toString()} disabled control={{}} label="SPH" name="sph" isRequired />

        <TextInput
          disabledText={getUserInfo()}
          disabled
          control={{}}
          label="Pembuat Taksasi"
          name="creator"
          isRequired
        />

        <TextInput
          disabledText={isEdit ? item?.taxation?.harvestChapel : item?.block?.harvestChapel}
          disabled
          control={{}}
          label="Kapel Panen"
          name="harvestChapel"
          isRequired
        />

        <DatePicker
          name="date"
          minimumDate={new Date(item?.harvestDate)}
          maximumDate={new Date(item?.harvestDate)}
          control={control}
          label="Tanggal Taksasi"
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
          isFloat={true}
          placeholder="Contoh: 10"
          control={control}
          label="Ha Hari Ini"
          name="hectareRestOfToday"
          isRequired
          errorText={errors?.hectareRestOfToday?.message}
          onChangeText={value => {
            calculateHaEsokHari(value)
          }}
          // onChangeText={v => calculateTotalHectares(v)}
        />

        <TextInput
          disabled
          isFloat={true}
          disabledText={haTomorrowWatcher}
          isNumber
          placeholder="Contoh: 10"
          control={control}
          label="Ha Esok Hari"
          name="hectareRestOfTommorow"
          isRequired
          errorText={errors?.hectareRestOfTommorow?.message}
        />

        <TextInput
          disabled
          isFloat={true}
          disabledText={haRealizationWatcher}
          isNumber
          placeholder="Contoh: 10"
          control={control}
          label="Realisasi Ha"
          name="haRealization"
          isRequired
          errorText={errors?.haRealization?.message}
        />

        <TextInput
          disabled
          disabledText={item?.block?.blockArea || '-'}
          isNumber
          isFloat={true}
          placeholder="Contoh: 40"
          control={control}
          label="Total Ha"
          name="totalHectares"
          isRequired
          errorText={errors?.totalHectares?.message}
        />

        <TextInput
          disabled
          disabledText={
            isNaN(
              (parseFloat(item.akpPercent.toString()) / 100) *
                parseFloat(item?.sph) *
                parseFloat(item?.block?.blockArea),
            )
              ? '-'
              : (
                  (parseFloat(item.akpPercent.toString()) / 100) *
                  parseFloat(item?.sph) *
                  parseFloat(item?.block?.blockArea)
                ).toFixed(2)
          }
          isNumber
          placeholder="Contoh: 10"
          control={control}
          label="Janjang Masak (AKP x SPH x Total Ha)"
          name="ripeFruit"
          isRequired
          errorText={errors?.ripeFruit?.message}
        />

        <TextInput
          isNumber
          isFloat={true}
          placeholder="Contoh: 20"
          control={control}
          label="BJR"
          name="bjr"
          isRequired
          errorText={errors?.bjr?.message}
          onChangeText={v => calculateKilogram(undefined, v)}
        />

        <TextInput
          disabled
          disabledText={kilogramWatcher}
          isNumber
          control={control}
          errorText={errors?.kilogram?.message}
          label="Kilogram (Janjang Masak x BJR)"
          name="kilogram"
          isRequired
        />

        <SelectInput
          defaultValue={control._defaultValues.calculationReference}
          isRequired
          items={CalculationReferences}
          control={control}
          label="Acuan Hitung"
          placeholder="Pilih Acuan Hitung"
          name="calculationReference"
          key="calculationReference"
          errorText={errors?.calculationReference?.message}
          onChange={v => {
            setValue('numberOfEmployees', '', {shouldValidate: true})
            setValue('kilogramPerHk', '', {shouldValidate: true})
          }}
        />

        <TextInput
          disabled={!(calcReferenceWatcher == 'Jumlah Karyawan' || calcReferenceWatcher == 'Jumlah HK')}
          disabledText={numberOfEmployeesWatcher}
          isNumber
          isFloat={true}
          placeholder="Contoh: 2.5"
          control={control}
          label="Jumlah HK"
          name="numberOfEmployees"
          isRequired
          errorText={errors?.numberOfEmployees?.message}
          onChangeText={v => calculateKilogramPerHk(v)}
        />

        <TextInput
          errorText={errors?.kilogramPerHk?.message}
          disabled={!(calcReferenceWatcher == 'Kilogram/HK')}
          disabledText={kilogramPerHkWatcher}
          isNumber
          isFloat={true}
          placeholder="Contoh: 12"
          control={control}
          label="Kilogram / HK"
          name="kilogramPerHk"
          isRequired
          onChangeText={v => calculateNumberofEmployeesPerHk(v)}
        />
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  )
}

export default TaxationForm
