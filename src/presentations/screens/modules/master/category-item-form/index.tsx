import React, {useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {TextInput, Button, Text, Header, Loader} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {ICategoryItemFormData} from '@models/eplant/CategoryItem'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'

let validationSchema = yup.object().shape({
  name: yup.string().required('Nama Kategori Item wajib diisi!'),
})

export default function CategoryItemForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id)

  const {formCategoryItemStatus, categoryItemDetail} = useSelector((state: RootStateType) => state.categoryItem)

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
      name: item?.name,
      description: item?.description,
    },
  })

  useEffect(() => {
    const error = formCategoryItemStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formCategoryItemStatus?.error])

  useEffect(() => {
    const data = formCategoryItemStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(` ${isEdit ? data?.response?.name || item?.name + ' berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formCategoryItemStatus?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getCategoryItemDetail.request({loading: true, data: item.id}))
    }
  }, [])

  useEffect(() => {
    if (isEdit && categoryItemDetail?.data?.id === item.id) {
      reset({
        id: categoryItemDetail?.data?.id,
        name: categoryItemDetail?.data?.name,
        description: categoryItemDetail?.data?.description,
      })
    }
  }, [categoryItemDetail?.data])

  const onSubmit = (data: ICategoryItemFormData) => {
    if (isEdit) {
      dispatch(actions.editCategoryItem.request({loading: true, data}))
      return
    }
    dispatch(actions.createCategoryItem.request({loading: true, data}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah Item Kategori' : 'Tambah Item Kategori'} />
      <Loader loading={Boolean(categoryItemDetail?.loading)} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <TextInput
            control={control}
            label="Nama Item Kategori"
            placeholder="Contoh : Alat Berat"
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
          <TextInput
            control={control}
            label="Deskripsi"
            placeholder="Contoh : Kendaraan Alat Berat dengan beban lebih dari 2000 kg"
            name="description"
            errorText={errors?.description?.message}
          />
          <Button
            disabled={Boolean(formCategoryItemStatus?.loading || !isDirty || !isValid)}
            onPress={handleSubmit(onSubmit)}>
            <Text color="white">
              {formCategoryItemStatus?.loading ? 'Loading...' : isEdit ? 'Ubah Item Kategori' : 'Tambah Item Kategori'}
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
