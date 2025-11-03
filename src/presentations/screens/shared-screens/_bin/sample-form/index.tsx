import React, {useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {TextInput, Button, Text} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {ILeadFormData} from '@models/crm/Lead'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'

let validationSchema = yup.object().shape({
  name: yup.string().required('Name is a required field!'),
})

export default function SampleForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?._id)

  const {formLeadStatus} = useSelector((state: RootStateType) => state.lead)

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      status: '605838e89beca440ecd733da',
      companyName: 'tes companyName',
    },
  })

  useEffect(() => {
    const error = formLeadStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formLeadStatus?.error])

  useEffect(() => {
    const data = formLeadStatus?.data?.data
    if (data?.status === 'ok') {
      showSuccessToast(`${data?.response?.name || item.name} ${isEdit ? 'Edited' : 'Created'}`)
      navigation.goBack()
    }
  }, [formLeadStatus?.data])

  useEffect(() => {
    dispatch(actions.createLead.failure({loading: false}))
  }, [])

  const onSubmit = (data: ILeadFormData) => {
    if (isEdit) {
      dispatch(actions.editLead.request({loading: true, data}))
      return
    }
    dispatch(actions.createLead.request({loading: false, data}))
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <TextInput
            useDarkTheme={true}
            control={control}
            label="Name"
            placeholder="name..."
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
        </ScrollView>
        <Button disabled={Boolean(formLeadStatus?.loading || !isDirty || !isValid)} onPress={handleSubmit(onSubmit)}>
          <Text color="white">Save</Text>
        </Button>
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
