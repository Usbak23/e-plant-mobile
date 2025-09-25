import React, {useEffect, useState, Fragment} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {TextInput, Button, Text, Header, Loader, SelectInput} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {IItemFormData, typeItem} from '@models/eplant/Item'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useMasterItemOptions} from '@app/domain/states/master-item/hooks'
import {useUsersByOrganization2} from '@app/domain/states/user/hooks'
import {IOrganizationRowAll} from '@app/models/eplant/Organization'
import IOption from '@app/models/commons/IOption'

const val1 = {
  typeItem: yup.string().required('Item Kategori wajib diisi!').typeError('Isi Item Kategori dengan benar'),
  itemMasterId: yup.string().required('Master Item wajib diisi!').typeError('Isi Master Item dengan benar'),
  name: yup.string().required('Nama Master Item wajib diisi!').typeError('Isi Nama Master Item dengan benar'),
  serialNumber: yup.string().required('Nomor Seri wajib diisi!').typeError('Isi Nomor Seri dengan benar'),
  model: yup.string().required('Model wajib diisi!').typeError('Isi Model dengan benar'),
  yearOfPurchase: yup.string().required('Tahun Pembelian wajib diisi!').typeError('Isi Tahun Pembelian dengan benar'),
  organizationId: yup.string().required('Organisasi wajib diisi!').typeError('Pilih organisasi terlebih dahulu'),
  personResponsibleId: yup.string().required('Penanggung Jawab wajib diisi!').typeError('Penanggung wajib harus diisi'),
}

let validationSchema = yup.object().shape(val1)

let validationSchemaVehicle = yup.object().shape({
  ...val1,
  vehicleOwnership: yup.string().required('Tipe kendaraan wajib diisi!').typeError('Tipe kendaraan perlu diisi'),
  capacity: yup.string().required('Kapasitas kendaraan wajib diisi!').typeError('Kapasitas kendaraan perlu diisi'),
  weight: yup.string().required('Berat kendaraan wajib diisi!').typeError('Berat kendaraan perlu diisi'),
  bbmBase: yup.number().nullable().typeError('Isi Basis BBM dengan benar').typeError('Isi Basis BBM dengan benar'),
})

const TYPE_ITEMS: typeItem[] = ['Kendaraan', 'Peralatan', 'Perlengkapan']
export const categoryItems = TYPE_ITEMS.map(e => ({label: e, value: e}))

export default function ItemForm() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const module = route.params?.module
  const isEdit = Boolean(item?.id)
  const isRelated = Boolean(module?.id)

  const {formItemStatus, itemDetail} = useSelector((state: RootStateType) => state.item)
  const [typeItems, setTypeItem] = useState(item?.typeItem || 'Kendaraan')

  const [selectedOrganization, setSelectedOrganization] = useState(
    itemDetail?.data?.organization?.id || item?.organization?.id,
  )
  const organizations = useOrganizationOptions()
  const masterItems = useMasterItemOptions()
  // const users = useUsers()
  const users = useUsersByOrganization2(selectedOrganization)

  const validationWithVehicle = useYupValidationResolver(validationSchemaVehicle)
  const validationDefault = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: {errors, isValid, isDirty},
    reset,
  } = useForm({
    resolver: typeItems === 'Kendaraan' ? validationWithVehicle : validationDefault,
    mode: 'onChange',
    defaultValues: {
      id: item?.id,
      typeItem: item?.typeItem,
      itemMasterId: item?.itemMaster?.id || module?.id,
      name: item?.name,
      serialNumber: item?.serialNumber,
      model: item?.model,
      yearOfPurchase: item?.yearOfPurchase?.toString(),
      vehicleOwnership: item?.vehicleOwnership,
      capacity: item?.capacity?.toString(),
      weight: item?.weight?.toString(),
      organizationId: item?.organization?.id,
      personResponsibleId: item?.personResponsible?.id,
      bbmBase: item?.bbmBase != null && item?.bbmBase != undefined ? item?.bbmBase?.toString() : '',
    },
  })

  useEffect(() => {
    const error = formItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formItemStatus?.error])

  useEffect(() => {
    const data = formItemStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(` ${isEdit ? data?.response?.name || item?.name + ' berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formItemStatus?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getItemDetail.request({loading: true, data: item.id}))
    }
    dispatch(actions.getMasterItemAll.request({loading: true}))
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllUser.request({loading: true}))
  }, [])

  useEffect(() => {
    if (isEdit && itemDetail?.data?.id === item.id && !!itemDetail?.data?.name) {
      reset({
        id: itemDetail?.data?.id,
        typeItem: itemDetail?.data?.typeItem,
        serialNumber: itemDetail?.data?.serialNumber,
        itemMasterId: itemDetail?.data?.itemMaster?.id,
        name: itemDetail?.data?.name,
        model: itemDetail?.data?.model,
        yearOfPurchase: itemDetail?.data?.yearOfPurchase?.toString(),
        vehicleOwnership: itemDetail?.data?.vehicleOwnership,
        capacity: itemDetail?.data?.capacity?.toString(),
        weight: itemDetail?.data?.weight?.toString(),
        organizationId: itemDetail?.data?.organization?.id,
        personResponsibleId: itemDetail?.data?.personResponsible?.id,
        bbmBase:
          itemDetail?.data?.bbmBase != null && itemDetail?.data?.bbmBase != undefined
            ? itemDetail?.data?.bbmBase?.toString()
            : '',
      })
      setTypeItem(itemDetail?.data?.typeItem || 'Kendaraan')
    }
  }, [itemDetail?.data])

  const trimForm = (data: IItemFormData) => {
    delete data?.bbmBase
    delete data?.vehicleOwnership
    delete data?.capacity
    delete data?.weight
    return data
  }

  const onSubmit = (data: IItemFormData) => {
    const payload = data?.typeItem != 'Kendaraan' ? trimForm(data) : data
    if (isEdit) {
      dispatch(actions.editItem.request({loading: true, data: payload}))
      return
    }

    dispatch(actions.createItem.request({loading: true, data: payload}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah Item' : 'Tambah Item'} />
      <Loader loading={Boolean(itemDetail?.loading)} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SelectInput
            disabled={isEdit}
            disabledText={
              organizations?.find((o: IOption) => o?.value == itemDetail?.data?.organization?.id)?.label || '-'
            }
            control={control}
            items={organizations}
            label="Organisasi"
            placeholder="Pilih Organisasi"
            name="organizationId"
            errorText={errors?.organizationId?.message}
            isRequired
            onChange={v => {
              setValue('organizationId', v, {shouldValidate: true})
              setValue('personResponsibleId', '', {shouldValidate: true})
              setSelectedOrganization(v)
            }}
          />
          <SelectInput
            control={control}
            items={masterItems}
            label="Master Item"
            placeholder="Pilih Master Item"
            name="itemMasterId"
            errorText={errors?.itemMasterId?.message}
            isRequired
            disabled={isRelated || isEdit}
            disabledText={isRelated ? module?.name : isEdit ? itemDetail?.data?.itemMaster?.name : '-'}
          />
          <SelectInput
            disabled={isEdit}
            disabledText={isEdit ? itemDetail?.data?.typeItem : '-'}
            control={control}
            items={categoryItems}
            label="Item Kategori"
            placeholder="Pilih Kategori Item"
            name="typeItem"
            errorText={errors?.typeItem?.message}
            onChange={v => {
              setTypeItem(v)
            }}
            isRequired
          />
          <TextInput
            control={control}
            label="Nama Item"
            placeholder="Contoh : Aspalt"
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="No. Seri"
            placeholder="Contoh : 112234455"
            name="serialNumber"
            errorText={errors?.serialNumber?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="Model"
            placeholder="Contoh : Motor Grader"
            name="model"
            errorText={errors?.model?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="Tahun Pembelian"
            placeholder="Contoh : 2019"
            name="yearOfPurchase"
            errorText={errors?.yearOfPurchase?.message}
            isRequired
            isNumber
          />
          {typeItems === 'Kendaraan' && (
            <Fragment>
              <SelectInput
                control={control}
                items={[
                  {label: 'Sewa', value: 'Sewa'},
                  {label: 'Milik sendiri', value: 'Milik sendiri'},
                ]}
                label="Tipe Kendaraan"
                placeholder="Pilih Tipe kendaraan"
                name="vehicleOwnership"
                errorText={errors?.vehicleOwnership?.message}
                isRequired
              />
              <TextInput
                control={control}
                label="Berat Kendaraan"
                placeholder="Contoh : 200 kg"
                name="weight"
                errorText={errors?.weight?.message}
                isRequired
                isNumber
              />
              <TextInput
                control={control}
                label="Basis BBM (Km/Liter)"
                placeholder="Contoh : 15"
                name="bbmBase"
                errorText={errors?.bbmBase?.message}
                isRequired
                isNumber
              />
              <TextInput
                control={control}
                label="Kapasitas Kendaraan"
                placeholder="Contoh : 2000 kg"
                name="capacity"
                errorText={errors?.capacity?.message}
                isRequired
                isNumber
              />
            </Fragment>
          )}

          <SelectInput
            defaultValue={item?.personResponsibleId}
            control={control}
            items={users}
            label="Penanggung Jawab"
            placeholder="Pilih Penanggung Jawab"
            name="personResponsibleId"
            errorText={errors?.personResponsibleId?.message}
            isRequired
          />
          <Button disabled={Boolean(formItemStatus?.loading)} onPress={handleSubmit(onSubmit)}>
            <Text color="white">{formItemStatus?.loading ? 'Loading...' : isEdit ? 'Ubah Item' : 'Tambah Item'}</Text>
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
