import React, { useEffect, useState } from 'react'
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { useNavigation, useRoute } from '@react-navigation/native'
import { showErrorToast, showSuccessToast } from '@components/Toast'
import { TextInput, Button, Text, Header, SelectInput, Loader } from '@components/index'
import { actions, RootStateType } from '@domain/states/store'

import { useDispatch, useSelector } from 'react-redux'
import { IOrganizationFormData } from '@models/eplant/Organization'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useCityOptions, useProvinceOptions } from '@app/domain/states/master/hooks'
import { useUsersByOrganization2 } from '@app/domain/states/user/hooks'

let validationSchema = yup.object().shape({
  name: yup.string().required('Nama Organisasi adalah bidang yang wajib diisi!'),
  address: yup.string().required('Alamat Organisasi adalah bidang yang wajib diisi!'),
  provinceId: yup.string().required('Provinsi adalah bidang yang wajib diisi!'),
  districtId: yup.string().required('Kota adalah bidang yang wajib diisi!'),
  phone: yup.string().required('Nomor Telepon adalah bidang yang wajib diisi!'),
  organizationArea: yup.number().required('Luas Organisasi wajib diisi').min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas organisasi dengan benar').transform((value) => !!value ? value : null),
  usedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas terpakai dengan benar').transform((value) => !!value ? value : null),
  unusedArea: yup.number().nullable().min(0, 'Luas tidak boleh negatif').typeError('Masukkan luas tidak terpakai dengan benar').transform((value) => !!value ? value : null)
})

export default function OrganizationForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id)

  const { formOrganizationStatus, organizationDetail } = useSelector((state: RootStateType) => state.organization)

  const [province, setProvince] = useState(item?.province?.id || '')

  const provinces = useProvinceOptions()
  const cities = useCityOptions(province)
  const users = useUsersByOrganization2(item?.id)

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      id: item?.id,
      name: item?.name,
      address: item?.address,
      phone: item?.phone,
      districtId: item?.district?.id,
      provinceId: item?.province?.id,
      manajerEstate: item?.manajerEstate?.id,
      organizationArea: item?.organizationArea,
      usedArea: item?.usedArea,
      unusedArea: item?.unusedArea
    },
  })

  useEffect(() => {
    const error = formOrganizationStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formOrganizationStatus?.error])

  useEffect(() => {
    const data = formOrganizationStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(` ${isEdit ? data?.response?.name || item?.name + ' berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formOrganizationStatus?.data])

  useEffect(() => {
    if (isEdit && organizationDetail?.data?.id === item.id) {
      reset({
        id: organizationDetail?.data?.id,
        name: organizationDetail?.data?.name,
        address: organizationDetail?.data?.address,
        phone: organizationDetail?.data?.phone,
        districtId: organizationDetail?.data?.district?.id,
        provinceId: organizationDetail?.data?.province?.id,
        manajerEstate: organizationDetail?.data?.manajerEstate?.id,
        organizationArea: organizationDetail?.data?.organizationArea ? organizationDetail?.data?.organizationArea?.toString() : '',
        usedArea: organizationDetail?.data?.usedArea ? organizationDetail?.data?.usedArea?.toString() : '',
        unusedArea: organizationDetail?.data?.unusedArea ? organizationDetail?.data?.unusedArea?.toString() : ''
      })
      setProvince(organizationDetail?.data?.province?.id)
    }
  }, [organizationDetail?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getOrganizationDetail.request({ loading: true, data: item.id }))
    }
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getProvinces.request({ loading: true }))
    dispatch(actions.editOrganization.failure({ loading: false }))
  }, [])

  const onSubmit = (data: IOrganizationFormData) => {
    if (isEdit) {
      dispatch(actions.editOrganization.request({ loading: true, data }))
      return
    }
    dispatch(actions.createOrganization.request({ loading: true, data }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah Organisasi' : 'Tambah Organisasi'} />
      <Loader loading={Boolean(organizationDetail?.loading)} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TextInput
            control={control}
            label="Nama Organisasi"
            placeholder="Contoh : PT. Sahabat Agro Group"
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="Luas Organisasi"
            placeholder="Contoh : 30 Ha"
            name="organizationArea"
            errorText={errors?.organizationArea?.message}
            isRequired
            isNumber
            isFloat
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
          <TextInput
            multiline={false}
            control={control}
            label="Alamat Organisasi"
            placeholder="Contoh : JL Sunter Agung Podomoro Blok N2, No. 9 - 10, Sunter, RT.10/RW.11, Sunter Jaya, Tj. Priok, Kota Jakarta Utara, Daerah Khusus Ibukota Jakarta 14350"
            name="address"
            errorText={errors?.address?.message}
            isRequired
          />
          <SelectInput
            items={provinces}
            control={control}
            label="Provinsi"
            placeholder="Pilih Provinsi"
            name="provinceId"
            key="provinceId"
            errorText={errors?.provinceId?.message}
            onChange={v => {
              setValue('districtId', '', {
                shouldValidate: true,
              })
              setProvince(v)
            }}
            isRequired
          />
          <SelectInput
            items={cities}
            control={control}
            label="Kota/Kabupaten"
            placeholder="Pilih Kota/Kabupaten"
            name="districtId"
            key="districtId"
            disabled={province.length === 0}
            errorText={errors?.districtId?.message}
            disabledClickable
            isRequired
          />
          <TextInput
            control={control}
            label="Nomor Telepon"
            placeholder="Contoh : 081234567890"
            name="phone"
            errorText={errors?.phone?.message}
            isNumber
            isRequired
          />

          {isEdit && (
            <SelectInput
              items={isEdit ? users : []}
              control={control}
              label="Manager Estate"
              placeholder="Pilih Manajer Estate"
              name="manajerEstate"
              key="manajerEstate"
              errorText={errors?.manajerEstate?.message}
            />
          )}

          <Button
            disabled={Boolean(formOrganizationStatus?.loading || !isDirty || !isValid)}
            onPress={handleSubmit(onSubmit)}>
            <Text color="white">
              {formOrganizationStatus?.loading ? 'Loading...' : isEdit ? 'Ubah Organisasi' : 'Tambah Organisasi'}
            </Text>
          </Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 18,
  },
  scrollView: {
    paddingBottom: 100,
  },
})
