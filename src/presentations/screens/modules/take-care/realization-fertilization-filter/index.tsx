import {theme} from '@app/presentations/utils/styles'
import {Button, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import React, {useState} from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useNavigation} from '@react-navigation/native'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useRangeMonths, useRangeYears} from '@app/domain/states/master/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import Routes from '@app/presentations/navigation/Routes'

const validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  divisionId: yup.string().required('Divisi wajib dipilih'),
  month: yup.string().required('Bulan wajib dipilih').typeError('Masukkan bulan dengan benar'),
  year: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tahun dengan benar'),
})

const RealizationFertilizationFilter = () => {
  const resolver = useYupValidationResolver(validationSchema)
  const navigation: any = useNavigation()
  const organizations = useOrganizationOptions()
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const years = useRangeYears()
  const months = useRangeMonths()
  const divisions = useDivisionsByOrganization(selectedOrganization)

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
      organizationId: '',
      divisionId: '',
      month: '',
      year: new Date().getFullYear().toString(),
    },
  })

  const onSubmit = (form: any) => {
    const organization = organizations.find((o: any) => o.value === form.organizationId)
    const division = divisions.find((d: any) => d.value === form.divisionId)
    const month = months.find((m: any) => m.value === form.month)
    const obj = {
      organization,
      division,
      year: form.year,
      month,
    }
    navigation.navigate(Routes.REALIZATION_FERTILIZATION_LIST, {...obj})
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Realisasi Pemupukan" />
      <ScrollView contentContainerStyle={{paddingBottom: 56}} style={styles.scrollView}>
        <SelectInput
          isRequired
          placeholder="Pilih Organisasi"
          control={control}
          label="Organisasi"
          name={'organizationId'}
          errorText={errors?.organizationId?.message}
          items={organizations}
          onChange={v => {
            setSelectedOrganization(v)
            setValue('divisionId', '', {shouldValidate: true})
            setValue('organizationId', v, {shouldValidate: true})
          }}
        />
        <SelectInput
          isRequired
          placeholder="Pilih Divisi"
          control={control}
          label="Divisi"
          errorText={errors?.divisionId?.message}
          name={'divisionId'}
          items={divisions}
          onChange={v => {
            setValue('divisionId', v, {shouldValidate: true})
          }}
        />

        <SelectInput
          errorText={errors?.month?.message}
          control={control}
          name={'month'}
          label="Bulan"
          isRequired
          placeholder="Bulan"
          items={months}
        />
        <SelectInput
          errorText={errors?.year?.message}
          control={control}
          name={'year'}
          label="Tahun"
          isRequired
          placeholder="Tahun"
          items={years}
        />

        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Pilih Realisasi Pemupukan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RealizationFertilizationFilter

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    padding: 16,
  },
})
