import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {theme} from '@app/presentations/utils/styles'
import {Button, DatePicker, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import React from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation, useRoute} from '@react-navigation/native'
import {REQUEST_TYPE} from '@app/models/eplant/Request'
import Routes from '@app/presentations/navigation/Routes'
import {showErrorToast} from '@app/presentations/_shared-components/Toast'

let validationSchema = yup.object().shape({
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  type: yup.string().required('Tipe wajib dipilih').typeError('Masukkan tipe dengan benar'),
})

const MyRequestFormFirst = () => {
  const navigation = useNavigation()
  const route: any = useRoute()
  const parent = route?.params?.parent
  const user = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)

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
      date: '',
      type: '',
    },
  })

  const onSubmit = (form: any) => {
    if (notValidMonths()) {
      showErrorToast('Bulan yang anda pilih sudah lewat')
      return
    }
    Object.assign(parent, {date: form.date, type: form.type})

    switch (form.type) {
      case 'Alat':
        //@ts-ignore
        navigation.navigate(Routes.MY_REQUEST_FORM_TOOL, {parent})
        break
      case 'Material':
        //@ts-ignore
        navigation.navigate(Routes.MY_REQUEST_FORM_MATERIAL, {parent})
        break
      case 'Transportasi':
        //@ts-ignore
        navigation.navigate(Routes.MY_REQUEST_FORM_TRANSPORTATION, {parent})
        break
      case 'Uang Tunai':
        //@ts-ignore
        navigation.navigate(Routes.MY_REQUEST_FORM_CASH, {parent})
        break
    }
  }

  const notValidMonths = (): boolean => {
    const currentMonth = new Date().getMonth() + 1
    if (parseInt(parent?.month.value) < currentMonth) {
      return true
    }
    return false
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tambah Permintaan" />
      <ScrollView style={styles.scroll}>
        <TextInput
          label="Organisasi"
          control={{}}
          name={'organization'}
          disabled={true}
          disabledText={parent?.organization?.label || '-'}
        />
        <TextInput
          label="Divisi"
          control={{}}
          name={'division'}
          disabled={true}
          disabledText={parent?.division?.label || '-'}
        />
        <TextInput label="Pengaju" control={{}} name={'requester'} disabled={true} disabledText={user?.name || '-'} />
        <DatePicker
          // value={new Date(getValues('dateRkh')).toISOString()}
          name="date"
          control={control}
          label="Tanggal"
          placeholder="Pilih tanggal"
          errorText={errors?.date?.message}
          isRequired={true}
          // minimumDate={new Date(parseInt(parent?.year), parseInt(parent?.month?.value) - 1, 1)}
          minimumDate={notValidMonths() ? undefined : new Date()}
          maximumDate={new Date(parseInt(parent?.year), parseInt(parent?.month?.value), 0)}
          onChangeText={value => {
            setValue('date', value, {
              shouldValidate: true,
            })
          }}
        />
        <SelectInput
          isRequired
          errorText={errors?.type?.message}
          control={control}
          name="type"
          label="Tipe Permintaan"
          placeholder="Pilih Tipe Permintaan"
          items={REQUEST_TYPE}
        />
        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Tambah Permintaan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyRequestFormFirst

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
})
