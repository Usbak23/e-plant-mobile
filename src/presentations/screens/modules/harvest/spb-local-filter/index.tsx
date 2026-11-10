import React, {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {Button, DatePicker, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import * as yup from 'yup'
import {useDispatch, useSelector} from 'react-redux'
import {RootStateType, actions} from '@app/domain/states/store'
import moment from 'moment'

const validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  divisionId: yup.string().required('Divisi wajib dipilih'),
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
})

const SPBLocalFilter = () => {
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch: any = useDispatch()

  const [organization, setOrganization] = useState('')

  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organization)
  const divisionAll = useSelector((state: RootStateType) => state.division?.divisionAll?.data || [])

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {organizationId: '', divisionId: '', date: ''},
  })

  useEffect(() => {
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
  }, [])

  const onSubmit = () => {
    const org = organizations.find(o => o.value === getValues('organizationId'))
    const div = divisionAll.find((o: any) => o.id === getValues('divisionId'))
    navigation.navigate(Routes.SPB_LOCAL_LIST, {
      divisionId: getValues('divisionId'),
      organizationId: getValues('organizationId'),
      date: moment(getValues('date')).format('YYYY-MM-DD'),
      organizationName: org?.label || '',
      divisionName: div?.name || '',
    })
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="SPB Local" />
      <ScrollView style={styles.scroll}>
        <SelectInput
          isRequired
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih organisasi"
          name="organizationId"
          errorText={errors?.organizationId?.message}
          onChange={(value: string) => {
            setOrganization(value)
            setValue('divisionId', '', {shouldValidate: true})
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
        />
        <DatePicker
          name="date"
          control={control}
          label="Tanggal SPB Local"
          placeholder="Pilih tanggal"
          errorText={errors?.date?.message}
          isRequired
          onChangeText={(value: any) => setValue('date', value, {shouldValidate: true})}
        />
        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Pilih</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SPBLocalFilter

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'white'},
  scroll: {padding: 16},
})
