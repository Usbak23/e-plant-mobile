import React from 'react'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {Button, DatePicker, Header, SelectInput, Text} from '@app/presentations/_shared-components'
import * as schema from '@utils/validation/attendance-filter-validation'
import {useNavigation} from '@react-navigation/native'
import Routes from '@app/presentations/navigation/Routes'
import {useOrganizationAll, useOrganizationOptions} from '@app/domain/states/organization/hooks'

const AttendanceFilter = () => {
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(schema.attendanceValidationSchema)
  const organizationAll = useOrganizationAll()
  const organizations = useOrganizationOptions()

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
      dateAttendance: '',
    },
  })

  const onSubmit = (form: any) => {
    const org = organizationAll.find(o => o.value == form.organizationId)
    navigation.navigate(Routes.ATTENDANCE_LIST, {
      attendanceData: {organization: org, dateAttendance: form.dateAttendance},
    })
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Absensi Karyawan" />

      <ScrollView style={styles.scroll}>
        <SelectInput
          isRequired
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih Organisasi"
          name="organizationId"
          errorText={errors?.organizationId?.message}
        />

        <DatePicker
          name="dateAttendance"
          control={control}
          label="Tanggal"
          placeholder="Pilih Tanggal"
          errorText={errors?.dateAttendance?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('dateAttendance', value, {
              shouldValidate: true,
            })
          }}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">Pilih Absensi</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AttendanceFilter

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    padding: 16,
  },
})
