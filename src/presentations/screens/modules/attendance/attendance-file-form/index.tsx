import React, { useEffect, useState } from 'react'
import styles from '@app/presentations/screens/modules/attendance/attendance-file-form/styles'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, Header, ModalAsk, SelectInput, Text } from '@app/presentations/_shared-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/attendance-file-form-validation'
import { useForm } from 'react-hook-form'
import SelectAttendanceFile from './select-file-view'
import { pick, keepLocalCopy } from '@react-native-documents/picker'
import { useWatch } from 'react-hook-form'
import { theme } from '@app/presentations/utils/styles'
import FeatherFolder from '@assets/icons/feather/feather_folder.svg'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDivisionsByOrganization } from '@app/domain/states/division/hooks'
import { IAttendanceFileFormData } from '@app/models/eplant/Attendance'
import { actions, RootStateType } from '@domain/states/store'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { IRSAttendance } from '@app/domain/states/attendance/reducer'

const AttendanceFileForm = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const attendanceData = route.params?.attendanceData
  const resolver = useYupValidationResolver(schema.attendanceFileFormValidationSchema)

  const divisions = useDivisionsByOrganization(attendanceData?.organization?.value)
  const { formAttendanceStatus }: IRSAttendance = useSelector((state: RootStateType) => state?.attendanceReducer || {})
  const [modalAsk, setModalAskOpen] = useState(false)
  const [requestBody, setRequestBody] = useState<IAttendanceFileFormData | undefined>()

  const {
    trigger,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      divisionId: '',
      date: attendanceData?.dateAttendance || '',
      file: {},
    },
  })

  const fileExcelWatcher = useWatch({ control, name: 'file', defaultValue: {} })

  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
        allowMultiSelection: false,
      })
      setValue('file', res[0], { shouldValidate: true })
      trigger()
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err
      }
    }
  }

  const onSubmit = (form: IAttendanceFileFormData) => {
    setRequestBody(form)
    setModalAskOpen(true)
  }

  const handleUpload = () => {
    dispatch(actions.uploadAttendanceFile.request({ loading: true, data: requestBody }))
  }

  useEffect(() => {
    const error = formAttendanceStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formAttendanceStatus?.error])

  useEffect(() => {
    const data = formAttendanceStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('File absensi berhasil diunggah')
      navigation.goBack()
    }
  }, [formAttendanceStatus?.data])

  const FileStatusView = () => (
    <View style={styles.fileStatusView}>
      <TouchableOpacity onPress={() => { }} style={styles.fileStatusLeft}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FeatherFolder width={36} height={36} />
          <Text
            color={theme.colors.accent}
            maxLines={2}
            style={{ flexShrink: 1, marginLeft: 8 }}
            type="semibold"
            size={14}>
            {fileExcelWatcher?.name || 'file_absensi'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => {
            setValue('file', {})
            trigger()
          }}
          style={styles.deleteFileButton}>
          <Icon name="delete" size={18} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Unggah File Absensi" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}>

        <SelectInput
          isRequired
          items={divisions}
          control={control}
          label="Divisi"
          placeholder="Pilih Divisi"
          name="divisionId"
          errorText={errors.divisionId?.message}
        />

        <SelectAttendanceFile onChooseFile={chooseFile} />

        {Object.keys(fileExcelWatcher).length != 0 && <FileStatusView />}

        <Text size={11} style={{ marginVertical: 8 }} type="semibold" color={theme.colors.redDark}>
          {errors?.file?.message}
        </Text>

        <Button
          disabled={Boolean(formAttendanceStatus?.loading)}
          style={{ marginTop: 58 }}
          onPress={handleSubmit(onSubmit)}>
          <Text color="white">Unggah File Absensi</Text>
        </Button>
      </ScrollView>
      <ModalAsk
        onPositiveButtonTap={handleUpload}
        isDanger={false}
        isOpen={modalAsk}
        onTouchOutside={() => {
          setRequestBody(undefined)
          setModalAskOpen(false)
        }}
        title={'Anda yakin ingin mengunggah file absensi?'}
        description={'Data divisi dan tanggal tersebut akan digantikan dengan data dari file ini'}
        positiveButtonText={'Unggah'}
      />
    </SafeAreaView>
  )
}

export default AttendanceFileForm
