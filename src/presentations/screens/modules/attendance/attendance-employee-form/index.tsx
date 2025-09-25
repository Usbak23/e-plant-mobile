import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {Button, DatePicker, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useForm} from 'react-hook-form'
import * as schema from '@utils/validation/attendance-employee-form-validation'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import {useNavigation, useRoute} from '@react-navigation/native'
import {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {useUsersByDivisionFull, useUsersByOrganizationFull} from '@app/domain/states/user/hooks'
import {IUserRow} from '@app/models/eplant/User'
import {IAttendanceFormData} from '@app/models/eplant/Attendance'
import {IRSAttendance} from '@app/domain/states/attendance/reducer'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'

const AttendanceEmployeeForm = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const attendanceData = route.params?.attendanceData
  const div = route.params?.division
  const resolver = useYupValidationResolver(schema.attendanceEmployeeFormValidationSchema)

  const divisions = useDivisionsByOrganization(attendanceData?.organization?.value)
  const [selectedDivision, setSelectedDivision] = useState(div?.id || '')
  const users = useUsersByDivisionFull(selectedDivision)

  const {formAttendanceStatus}: IRSAttendance = useSelector((state: RootStateType) => state?.attendanceReducer || {})
  const {rangeBreakTime} = useSelector((state: RootStateType) => state?.master || {})

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
      date: attendanceData?.dateAttendance || '',
      divisionId: div?.id || '',
      userId: '',
      in: '',
      out: '',
    },
  })

  const validateTimeStart = (): boolean => {
    const hhMMIn = getDetachedHourAndMinute(getValues('in'))
    const hhMMOut = getDetachedHourAndMinute(getValues('out'))
    if (hhMMIn[0] > hhMMOut[0]) {
      showErrorToast('Scan masuk tidak boleh lebih dari scan keluar')
      return false
    } else if (hhMMIn[0] == hhMMOut[0] && hhMMIn[1] > hhMMOut[1]) {
      showErrorToast('Menit scan masuk tak boleh lebih dari menit scan keluar jika pada jam yang sama')
      return false
    }
    return true
  }

  const validateBreakTime = (): boolean => {
    if (rangeBreakTime?.data) {
      return true
    }
    showErrorToast('Data Jam istirahat belum didapat. Pastikan untuk mendapatkannya saat online')
    return false
  }

  const validateTimeEnd = (): boolean => {
    const hhMMOut = getDetachedHourAndMinute(getValues('out'))
    const hhMMIn = getDetachedHourAndMinute(getValues('in'))
    if (hhMMOut[0] < hhMMIn[0]) {
      showErrorToast('Scan keluar tidak boleh lebih kecil dari scan masuk')
      return false
    } else if (hhMMIn[0] == hhMMOut[0] && hhMMIn[1] > hhMMOut[1]) {
      showErrorToast('Menit scan masuk tak boleh lebih dari menit scan keluar jika pada jam yang sama.')
      return false
    }
    return true
  }

  const getDifferenceInHours = (date1: Date, date2: Date) => {
    //@ts-expect-error
    const diffInMs = Math.abs(date2 - date1)
    return diffInMs / (1000 * 60 * 60)
  }

  const calculateWorkingHoursWithIsoma = (hourStart: string, hourEnd: string, workingHour: number) => {
    //check isoma
    const startAsInt = parseInt(hourStart.replace(':', ''))
    const endAsInt = parseInt(hourEnd.replace(':', ''))
    const breakTime = rangeBreakTime?.data?.time || ''
    if (breakTime != '') {
      const breakTimeAsInt = parseInt(breakTime.replace(':', ''))
      if (startAsInt <= breakTimeAsInt && endAsInt >= breakTimeAsInt) {
        //minus it
        const length = rangeBreakTime?.data?.length || 0
        const calculatedWorkingHours = workingHour - length < 0 ? workingHour : workingHour - length
        return calculatedWorkingHours
      }
      return workingHour
    }
    return workingHour
  }

  const constructOfflineData = (form: IAttendanceFormData) => {
    const diffHour = calculateWorkungHours(getValues('in'), getValues('out'))
    const diffHourWithIsoma = calculateWorkingHoursWithIsoma(getValues('in'), getValues('out'), parseFloat(diffHour))
    const user = users.find((u: IUserRow) => u.id == getValues('userId'))

    form.nip = user?.nip || '-'
    form.name = user?.name || '-'
    //353
    form.roleCategory = user?.role?.roleCategory || []
    form.workingHours = diffHourWithIsoma
    form.type = 'Manual'
    return form
  }

  const onSubmit = (form: IAttendanceFormData) => {
    if (validateTimeStart() && validateTimeEnd() && validateBreakTime()) {
      const formWithOffline = constructOfflineData(form)
      dispatch(actions.createAttendanceManually.request({loading: true, data: formWithOffline}))
    }
  }

  const calculateWorkungHours = (hourStart: string, hourEnd: string) => {
    const splittedStart = hourStart.split(':')
    const dateStart = new Date(`${attendanceData?.dateAttendance}`)
    dateStart.setUTCHours(parseInt(splittedStart[0]))
    dateStart.setUTCMinutes(parseInt(splittedStart[1]))

    const splittedEnd = hourEnd.split(':')
    const dateEnd = new Date(`${attendanceData?.dateAttendance}`)
    dateEnd.setUTCHours(parseInt(splittedEnd[0]))
    dateEnd.setUTCMinutes(parseInt(splittedEnd[1]))

    const hourDiff = getDifferenceInHours(dateEnd, dateStart)

    // const afterIsoma = hourDiff - 1 <= 0 ? hourDiff.toFixed(2) : (hourDiff - 1).toFixed(2)

    // return Math.abs(afterIsoma)
    return Math.abs(hourDiff).toFixed(2)
  }

  const getDetachedHourAndMinute = (HHmm: string): number[] => {
    const splitted = HHmm.split(':')
    return [parseInt(splitted[0]), parseInt(splitted[1])]
  }

  useEffect(() => {
    dispatch(actions.getAllDivision.request({loading: true}))
    dispatch(actions.getAllUser.request({loading: true}))
    dispatch(actions.getRangeBreakTime.request({loading: true}))
  }, [])

  useEffect(() => {
    const error = formAttendanceStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formAttendanceStatus?.error])

  useEffect(() => {
    const data = formAttendanceStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Karyawan berhasil ditambahkan')
      navigation.goBack()
    }
  }, [formAttendanceStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Tambah Karyawan" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: 56}}
        showsVerticalScrollIndicator={false}>
        <TextInput
          disabled={true}
          disabledText={attendanceData?.organization?.label}
          isRequired
          control={{}}
          label="Organisasi"
          placeholder="Pilih organisasi"
          name="organizationId"
        />
        <TextInput
          disabled={true}
          disabledText={attendanceData?.dateAttendance}
          isRequired
          control={{}}
          label="Tanggal"
          placeholder="Pilih tanggal"
          name="dateAttendance"
        />

        <SelectInput
          disabled={Boolean(div)}
          disabledText={div ? div.name : ''}
          isRequired
          items={divisions}
          control={control}
          label="Divisi"
          placeholder="Pilih divisi"
          name="divisionId"
          errorText={errors.divisionId?.message}
          onChange={v => {
            setSelectedDivision(v)
            setValue('userId', '')
          }}
        />

        <SelectInput
          isRequired
          items={users.map((u: IUserRow) => ({value: u.id, label: `${u.name} - ${u.nip}`}))}
          control={control}
          label="Nama Karyawan"
          placeholder="Nama Karyawan"
          name="userId"
          errorText={errors.userId?.message}
        />

        <DatePicker
          timeOnly={true}
          name="in"
          control={control}
          label="Scan Masuk"
          placeholder="Contoh: 07:15"
          errorText={errors?.in?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('in', value, {
              shouldValidate: true,
            })
          }}
        />

        <DatePicker
          name="out"
          timeOnly={true}
          control={control}
          label="Scan Keluar"
          placeholder="Contoh: 16:15"
          errorText={errors?.out?.message}
          isRequired={true}
          onChangeText={value => {
            setValue('out', value, {
              shouldValidate: true,
            })
          }}
        />

        <Button onPress={handleSubmit(onSubmit)} disabled={Boolean(formAttendanceStatus?.loading)}>
          <Text color="white">Tambah Karyawan</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AttendanceEmployeeForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    paddingBottom: 56,
    paddingHorizontal: 16,
  },
})
