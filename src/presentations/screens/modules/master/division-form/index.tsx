import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { theme } from '@app/presentations/utils/styles'
import { Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import Button from '@components/Button'
import { RFValue as fs } from 'react-native-responsive-fontsize'
import { actions, RootStateType } from '@domain/states/store'
import * as yup from 'yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '@components/Toast'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { IDivisionFormData } from '@app/models/eplant/Division'
import { useCurrentUserInfo, useUsersByOrganization2 } from '@app/domain/states/user/hooks'
let debounceSearch: NodeJS.Timeout

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Pilih organisasi terlebih dahulu'),
  name: yup.string().required('Nama divisi tidak boleh kosong'),
  area: yup
    .number()
    .required('Luas area harus diisi')
    .min(0, 'Minimum luas adalah 0')
    .typeError('Isi luas area terlebih dahulu'),
  assistantDivision: yup.string().nullable(),
  usedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas terpakai dengan benar').transform((value) => !!value ? value : null),
  unusedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas tidak terpakai dengan benar').transform((value) => !!value ? value : null)
})

const DivisionForm = () => {
  const user = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)
  const route: any = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const item = route.params?.item
  const module = route.params?.module
  const isEdit = Boolean(item?.id)

  const [selectedOrganization, setSelectedOrganization] = useState(item?.organization?.id || '')
  const { formDivisionStatus } = useSelector((state: RootStateType) => state.division)
  const organizations = useOrganizationOptions()
  const users = useUsersByOrganization2(selectedOrganization || module?.id)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      id: item?.id || undefined,
      organizationId: item?.organization?.id || module?.id || '',
      name: item?.name,
      area: item?.area.toString() || '',
      assistantDivision: item?.assistantDivision?.id || null,
      usedArea: item?.usedArea ? item?.usedArea?.toString() : '',
      unusedArea: item?.unusedArea ? item?.unusedArea?.toString() : ''

    },
  })

  const submitForm = (req: IDivisionFormData) => {
    if (isEdit) {
      dispatch(actions.editDivision.request({ loading: true, data: req }))
      return
    }
    dispatch(actions.createDivision.request({ loading: true, data: req }))
  }

  useEffect(() => {
    const error = formDivisionStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formDivisionStatus?.error])

  useEffect(() => {
    const data = formDivisionStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast(`${isEdit ? 'Berhasil diperbarui' : 'Berhasil disimpan'}`)
      navigation.goBack()
    }
  }, [formDivisionStatus?.data])

  useEffect(() => {
    if (user?.role?.isSuperAdmin) {
      dispatch(actions.getOrganizationAll.request({ loading: true, data: { type: 'all' } }))
    } else {
      dispatch(actions.getOrganizationAll.request({ loading: true }))
    }
    dispatch(actions.getAllUser.request({ loading: true }))
  }, [])

  const HeaderView = () => <Header title="Divisi" />
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <SelectInput
          disabledText={module?.name ? module?.name : isEdit ? item?.organization?.name : ''}
          disabled={module ? true : Boolean(isEdit)}
          defaultValue={control._defaultValues.organizationId}
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih Organisasi"
          name="organizationId"
          key="organization"
          errorText={errors?.organizationId?.message}
          onChange={v => {
            setSelectedOrganization(v)
            setValue('organizationId', v, {
              shouldValidate: true,
            })
            setValue('assistantDivision', null, {
              shouldValidate: true,
            })
          }}
          isRequired
        />
        <TextInput
          errorText={errors?.name?.message}
          name="name"
          control={control}
          placeholder="Contoh: Divisi - A01"
          label="Nama Divisi"
          isRequired
        />

        <SelectInput
          defaultValue={control._defaultValues.assistantDivision}
          items={users}
          control={control}
          label="Asisten Divisi"
          placeholder="Pilih asisten divisi"
          name="assistantDivision"
          key="assistantDivision"
          errorText={errors?.assistantDivision?.message}
          onChange={v => {
            const val = v == '' ? null : v
            setValue('assistantDivision', val, {
              shouldValidate: true,
            })
          }}
        />

        <TextInput
          isFloat
          isNumber
          errorText={errors?.area?.message}
          name="area"
          control={control}
          placeholder="Contoh: 30 Ha"
          label="Luas Divisi"
          isRequired
        />

        <TextInput
          control={control}
          label="Luas Terpakai"
          placeholder="Contoh : 20 Ha"
          name="usedArea"
          errorText={errors?.usedArea?.message}
          isNumber
          isFloat
        />
        <TextInput
          control={control}
          label="Luas Tidak Terpakai"
          placeholder="Contoh : 10 Ha"
          name="unusedArea"
          errorText={errors?.unusedArea?.message}
          isNumber
          isFloat
        />

        <Button
          disabled={Boolean(formDivisionStatus?.loading)}
          style={styles.submitButton}
          onPress={handleSubmit(submitForm)}>
          <Text type="semibold" style={styles.submitButtonText}>
            {isEdit ? 'Ubah Divisi' : 'Tambah Divisi'}
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DivisionForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: theme.colors.black,
    marginTop: 23,
  },
  submitButtonText: {
    fontSize: fs(13),
    color: theme.colors.white,
    fontWeight: 'normal',
  },
})
