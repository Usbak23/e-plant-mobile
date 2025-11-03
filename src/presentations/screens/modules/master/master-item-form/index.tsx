import React, {useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {TextInput, Button, Text, Header, Loader, SelectInput} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {IMasterItemFormData} from '@models/eplant/MasterItem'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useCategoryItemOptions} from '@domain/states/category-item/hooks'

let validationSchema = yup.object().shape({
  categoryItemId: yup.string().required('Kategori Item wajib diisi!').typeError('Isi Kategori Item dengan benar'),
  name: yup.string().required('Nama Master Item wajib diisi!'),
  description: yup.string().required('Deskripsi wajib diisi!'),
})

export default function MasterItemForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const module = route.params?.module
  const isEdit = Boolean(item?.id)
  const isRelated = Boolean(module?.id)

  const {formMasterItemStatus, masterItemDetail} = useSelector((state: RootStateType) => state.masterItem)
  const itemCategories = useCategoryItemOptions()
  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
    reset,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      id: item?.id,
      categoryItemId: item?.categoryItem?.id || module?.id,
      name: item?.name,
      description: item?.description,
    },
  })

  useEffect(() => {
    const error = formMasterItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formMasterItemStatus?.error])

  useEffect(() => {
    const data = formMasterItemStatus?.data?.data
    if (data?.code == 200) {
      showSuccessToast(`${isEdit ? data?.response?.name || item?.name + ' berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formMasterItemStatus?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getMasterItemDetail.request({loading: true, data: item.id}))
    }
    dispatch(actions.getCategoryItemAll.request({loading: true}))
  }, [])

  useEffect(() => {
    if (isEdit && masterItemDetail?.data?.id === item.id) {
      reset({
        id: masterItemDetail?.data?.id,
        name: masterItemDetail?.data?.name,
        description: masterItemDetail?.data?.description,
        categoryItemId: masterItemDetail?.data?.categoryItem?.id,
      })
    }
  }, [masterItemDetail?.data])

  const onSubmit = (data: IMasterItemFormData) => {
    if (isEdit) {
      dispatch(actions.editMasterItem.request({loading: true, data}))
      return
    }
    dispatch(actions.createMasterItem.request({loading: true, data}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah Master Item' : 'Tambah Master Item'} />
      <Loader loading={Boolean(masterItemDetail?.loading)} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SelectInput
            control={control}
            items={itemCategories}
            label="Item Kategori"
            placeholder="Alat Berat"
            name="categoryItemId"
            errorText={errors?.categoryItemId?.message}
            isRequired
            disabled={isRelated}
            disabledText={module?.name}
          />
          <TextInput
            control={control}
            label="Nama Master Item"
            placeholder="Contoh : Mitsubishi"
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="Deskripsi"
            placeholder="Contoh : Kendaraan Alat Berat dengan merek Mitsubishi"
            name="description"
            errorText={errors?.description?.message}
            isRequired
          />
          <Button
            disabled={Boolean(formMasterItemStatus?.loading || !isDirty || !isValid)}
            onPress={handleSubmit(onSubmit)}>
            <Text color="white">
              {formMasterItemStatus?.loading ? 'Loading...' : isEdit ? 'Ubah Master Item' : 'Tambah Master Item'}
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
