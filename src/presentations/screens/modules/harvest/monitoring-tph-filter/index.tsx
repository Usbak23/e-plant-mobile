import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {Button, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import * as yup from 'yup'
import moment from 'moment'

const months = [
  {value: '1', label: 'Januari'},
  {value: '2', label: 'Februari'},
  {value: '3', label: 'Maret'},
  {value: '4', label: 'April'},
  {value: '5', label: 'Mei'},
  {value: '6', label: 'Juni'},
  {value: '7', label: 'Juli'},
  {value: '8', label: 'Agustus'},
  {value: '9', label: 'September'},
  {value: '10', label: 'Oktober'},
  {value: '11', label: 'November'},
  {value: '12', label: 'Desember'},
]

const currentYear = new Date().getFullYear()
const years = Array.from({length: 5}, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}))

const validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib dipilih'),
  divisionId: yup.string().required('Divisi wajib dipilih'),
  month: yup.string().required('Bulan wajib dipilih'),
  year: yup.string().required('Tahun wajib dipilih'),
})

const MonitoringTphFilter = () => {
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(validationSchema)
  const [organization, setOrganization] = useState('')

  const {control, handleSubmit} = useForm({
    resolver,
    defaultValues: {
      organizationId: '',
      divisionId: '',
      month: String(new Date().getMonth() + 1),
      year: String(currentYear),
    },
  })

  const organizationOptions = useOrganizationOptions()
  const divisionOptions = useDivisionsByOrganization(organization)

  const onSubmit = (values: any) => {
    const orgData = organizationOptions.find((o: any) => o.value === values.organizationId)
    const divData = divisionOptions.find((d: any) => d.value === values.divisionId)
    navigation.navigate(Routes.MONITORING_TPH_LIST, {
      divisionId: values.divisionId,
      month: values.month,
      year: values.year,
      organizationName: orgData?.label || '',
      divisionName: divData?.label || '',
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Monitoring TPH" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pilih Filter</Text>

        <SelectInput
          label="Organisasi"
          placeholder="Pilih Organisasi"
          control={control}
          name="organizationId"
          items={organizationOptions}
          onChange={(v: string) => setOrganization(v)}
          isRequired
        />

        <SelectInput
          label="Divisi"
          placeholder="Pilih Divisi"
          control={control}
          name="divisionId"
          items={divisionOptions}
          isRequired
          disabled={!organization}
        />

        <SelectInput
          label="Bulan"
          placeholder="Pilih Bulan"
          control={control}
          name="month"
          items={months}
          isRequired
        />

        <SelectInput
          label="Tahun"
          placeholder="Pilih Tahun"
          control={control}
          name="year"
          items={years}
          isRequired
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          <Text color="white">Pilih</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  content: {padding: 16},
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 16},
  button: {marginTop: 24},
})

export default MonitoringTphFilter
