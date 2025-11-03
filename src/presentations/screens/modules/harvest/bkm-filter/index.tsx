import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Button, DatePicker, Header, SelectInput, Text } from '@app/presentations/_shared-components'
import * as schema from '@utils/validation/attendance-filter-validation'
import { useNavigation } from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import { useOrganizationAll, useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { useDivisionsByOrganization } from '@app/domain/states/division/hooks'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/domain/states/reducers'
import { actions } from '@app/domain/states/store'
import { useUsersByDivision } from '@app/domain/states/user/hooks'
import { useSubActivityOptions } from '@app/domain/states/subactivity/hooks'

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  divisionId: yup.string().required('Divisi wajib dipilih'),
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  foreman: yup.string().required('Mandor wajib dipilih'),
  subActivityId: yup.string().required('Pilih Sub Aktivitas dulu')
})

const BKMFilter = () => {
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch: any = useDispatch()

  const [organization, setOrganization] = useState('')
  const [divison, setDivision] = useState('')

  const organizationAll = useOrganizationAll()
  const divisionAll = useSelector((state: RootState) => state.division?.divisionAll?.data || [])
  const userAll = useSelector((state: RootState) => state.user?.userAll?.data || [])
  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organization)
  // const users = useForemanHarvestOptions(divison, true)
  const users = useUsersByDivision(divison)
  const subAktivitasPanenOptions = useSubActivityOptions('Panen')

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      organizationId: '',
      divisionId: '',
      date: '',
      foreman: '',
      subActivityId: ''
    },
  })

  useEffect(() => {
    dispatch(actions.clearFormBKMStatus())
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getSupervisions.request({ loading: true }))
    dispatch(actions.getWorkStatus.request({ loading: true }))
    dispatch(actions.getAllForemanX.request({ loading: true }))
  }, [])

  const onSubmit = () => {
    const org = organizationAll.find(o => o.value == getValues('organizationId'))
    const div = divisionAll.find(o => o.id == getValues('divisionId'))
    const usr = userAll.find(o => o.id == getValues('foreman'))
    const subActivity = subAktivitasPanenOptions.find(s => s.value == getValues('subActivityId'))

    console.log(getValues('subActivityId'), ' ==')

    dispatch(
      actions.getBKMMobile.request({
        loading: true,
        data: {
          organizationId: getValues('organizationId'),
          divisionId: getValues('divisionId'),
          date: getValues('date'),
          foremanId: getValues('foreman'),
          subActivityId: getValues('subActivityId')
        },
      }),
    )
    navigation.navigate(Routes.BKM_LIST, {
      bkmData: { organization: org, date: getValues('date'), division: div, foreman: usr, subActivity: subActivity },
    })
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Buku Kerja Mandor" />

      <ScrollView style={styles.scroll}>
        <SelectInput
          isRequired
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih organisasi"
          name="organizationId"
          errorText={errors?.organizationId?.message}
          onChange={value => {
            setOrganization(value)
            setDivision('')
            setValue('divisionId', '')
            setValue('foreman', '')
          }}
        />
        <SelectInput
          isRequired
          items={divisions}
          control={control}
          label="Divisi"
          placeholder="Pilih Divisi"
          name="divisionId"
          errorText={errors?.divisionId?.message}
          onChange={v => {
            setDivision(v)
            setValue('foreman', '', { shouldValidate: true })
          }}
        />

        <DatePicker
          name="date"
          control={control}
          label="Tanggal BKM"
          placeholder="Pilih tanggal"
          errorText={errors?.date?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('date', value, {
              shouldValidate: true,
            })
          }}
        />

        <SelectInput
          isRequired
          items={users}
          control={control}
          label="Mandor"
          placeholder="Pilih Mandor"
          name="foreman"
          errorText={errors?.foreman?.message}
        />

        <SelectInput
          isRequired
          items={subAktivitasPanenOptions}
          control={control}
          label="Sub Aktivitas"
          placeholder="Pilih Sub Aktivitas"
          name="subActivityId"
          errorText={errors?.subActivityId?.message}
        />

        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Pilih BKM</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BKMFilter

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 16,
  },
})
