import {Button, DatePicker, Header, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/core'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, View} from 'react-native'
import {styles} from './styles'
import {useForm} from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import * as schema from '@utils/validation/raw-material-validation'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {IRawMaterialFormData, IRawMaterialUpdateFormData} from '@app/models/eplant/RawMaterial'
import {useUomOptions} from '@app/domain/states/master/hooks'
import {actions, RootStateType} from '@domain/states/store'
import {useDispatch, useSelector} from 'react-redux'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'

const RawMaterialForm = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.rawMaterialValidationSchema)
  const resolverUpdate = useYupValidationResolver(schema.rawMaterialValidationUpdateSchema)
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id)
  const rawMaterialDetail = useSelector((state: RootStateType) => state.rawMaterial.rawMaterialDetail)

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
      name: '',
      code: '',
      organizationId: '',
      location: '',
      uomId: '',
      price: '',
      purchaseOrder: '',
      qty: '',
      minStock: '',
      date: '',
      type: '',
    },
  })

  const {
    handleSubmit: handleUpdate,
    control: controlUpdate,
    setValue: setValueUpdate,
    getValues: getValuesUpdate,
    formState: {errors: errorsUpdate, isValid: isValidUpdate, isDirty: isDirtyUpdate},
    reset,
  } = useForm({
    resolver: resolverUpdate,
    mode: 'onChange',
    defaultValues: {
      id: item?.id,
      name: '',
      code: '',
      organizationId: '',
      location: '',
      uomId: '',
      minStock: '',
    },
  })

  const organizations = useOrganizationOptions()
  const uoms = useUomOptions()
  const {formRawMaterialStatus} = useSelector((state: RootStateType) => state.rawMaterial)

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getRawMaterialDetail.request({loading: true, data: item?.id}))
    }
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getUoms.request({loading: true}))
  }, [])

  useEffect(() => {
    if (isEdit && rawMaterialDetail?.data?.id === item.id) {
      reset({
        id: rawMaterialDetail?.data?.id,
        name: rawMaterialDetail?.data?.name,
        code: rawMaterialDetail?.data?.code,
        organizationId: rawMaterialDetail?.data?.organization?.id,
        uomId: rawMaterialDetail?.data?.uom?.id,
        location: rawMaterialDetail?.data?.location,
        minStock: rawMaterialDetail?.data?.minStock?.toString() || '',
        type: rawMaterialDetail?.data?.type || '',
      })
    }
  }, [rawMaterialDetail?.data])

  useEffect(() => {
    const error = formRawMaterialStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRawMaterialStatus?.error])

  useEffect(() => {
    const data = formRawMaterialStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
      navigation.goBack()
    }
  }, [formRawMaterialStatus?.data])

  const onSubmit = (req: IRawMaterialFormData) => {
    dispatch(actions.createRawMaterial.request({loading: true, data: req}))
  }

  const onUpdate = (req: IRawMaterialUpdateFormData) => {
    dispatch(actions.editRawMaterial.request({loading: true, data: req}))
  }

  const HeaderView = () => <Header title={isEdit ? 'Ubah Material' : 'Tambah Material'} />
  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      {/* <View style={[styles.container, styles.contentContainer]}> */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        style={{paddingBottom: 16}}
        showsVerticalScrollIndicator={false}>
        <SelectInput
          disabled={Boolean(isEdit)}
          disabledText={rawMaterialDetail?.data?.type || '-'}
          defaultValue={isEdit ? controlUpdate._defaultValues.type : control._defaultValues.type}
          isRequired
          items={[
            {label: 'Pupuk', value: 'Pupuk'},
            {label: 'Non Pupuk', value: 'Non Pupuk'},
          ]}
          control={isEdit ? controlUpdate : control}
          label="Kategori Material"
          placeholder="Pilih Kategori Material"
          name="type"
          key="type"
          errorText={isEdit ? errorsUpdate?.type?.message : errors?.type?.message}
        />

        <TextInput
          disabled={isEdit}
          disabledText={isEdit ? getValuesUpdate('name') : '-'}
          defaultValue={isEdit ? controlUpdate._defaultValues.name : control._defaultValues.name}
          control={isEdit ? controlUpdate : control}
          label="Nama Material"
          placeholder="Contoh: Pupuk HCL"
          name="name"
          errorText={isEdit ? errorsUpdate?.name?.message : errors?.name?.message}
          isRequired
        />

        <TextInput
          disabled={isEdit}
          disabledText={isEdit ? getValuesUpdate('code') : '-'}
          defaultValue={isEdit ? controlUpdate._defaultValues.code : control._defaultValues.code}
          control={isEdit ? controlUpdate : control}
          label="Kode Material"
          placeholder="Contoh: HCL016"
          name="code"
          errorText={isEdit ? errorsUpdate?.code?.message : errors?.code?.message}
          isRequired
        />

        <SelectInput
          disabled={Boolean(isEdit)}
          disabledText={rawMaterialDetail?.data?.organization?.name || '-'}
          defaultValue={isEdit ? controlUpdate._defaultValues.organizationId : control._defaultValues.organizationId}
          isRequired
          items={organizations}
          control={isEdit ? controlUpdate : control}
          label="Organisasi"
          placeholder="Pilih organisasi"
          name="organizationId"
          key="organizationId"
          errorText={isEdit ? errorsUpdate?.organizationId?.message : errors?.organizationId?.message}
        />

        <TextInput
          disabled={isEdit}
          disabledText={getValuesUpdate('location') || '-'}
          control={isEdit ? controlUpdate : control}
          label="Lokasi"
          placeholder="Contoh: Gudang PT.PAL"
          name="location"
          errorText={isEdit ? errorsUpdate?.location?.message : errors?.location?.message}
          isRequired
        />

        <SelectInput
          disabled={isEdit}
          disabledText={rawMaterialDetail?.data?.uom?.name || '-'}
          defaultValue={isEdit ? controlUpdate._defaultValues.uomId : control._defaultValues.uomId}
          isRequired
          items={uoms}
          control={isEdit ? controlUpdate : control}
          label="Satuan"
          placeholder="Pilih satuan"
          name="uomId"
          key="uomId"
          errorText={isEdit ? errorsUpdate?.uomId?.message : errors?.uomId?.message}
        />

        {isEdit && (
          <TextInput
            control={isEdit ? controlUpdate : control}
            label="Stok Minimum"
            isNumber
            placeholder="Contoh: 10"
            name="minStock"
            errorText={errors?.minStock?.message}
            isRequired
          />
        )}

        {!isEdit && (
          <>
            <TextInput
              control={control}
              isNumber
              label="Jumlah"
              placeholder="Contoh: 100"
              name="qty"
              errorText={errors?.qty?.message}
              isRequired
            />

            <TextInput
              control={control}
              label="Stok Minimum"
              isNumber
              placeholder="Contoh: 10"
              name="minStock"
              errorText={errors?.minStock?.message}
              isRequired
            />

            <TextInput
              isCurrency={true}
              control={control}
              label="Harga"
              placeholder="Rp.500.000"
              name="price"
              errorText={errors?.price?.message}
              isRequired
            />

            <TextInput
              control={control}
              label="No. Purchase Order"
              placeholder="Contoh: PE-012"
              name="purchaseOrder"
              errorText={errors?.purchaseOrder?.message}
              isRequired
            />

            <DatePicker
              maximumDate={new Date()}
              name="date"
              control={control}
              label="Tanggal Pembelian"
              placeholder="Pilih tanggal"
              errorText={errors?.date?.message}
              isRequired={true}
              onChangeText={value => {
                setValue('date', value, {
                  shouldValidate: true,
                })
              }}
              // setDateValue={'2021-12-31'}
            />
          </>
        )}

        <Button style={{marginBottom: 26}} onPress={isEdit ? handleUpdate(onUpdate) : handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Material' : 'Tambah Material'}</Text>
        </Button>
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  )
}

export default RawMaterialForm
