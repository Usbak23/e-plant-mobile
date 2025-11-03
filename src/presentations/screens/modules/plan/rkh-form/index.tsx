import React, {useEffect} from 'react'
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {Button, Text, Header, DatePicker, TextInput, SelectInput} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {IRKHFormData} from '@models/eplant/RKH'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'

import {theme} from '@app/presentations/utils/styles'
import moment from 'moment'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import Routes from '@app/presentations/navigation/Routes'

let validationSchema = yup.object().shape({
  organizationId: yup.string().required('Organisasi wajib diisi!'),
  divisionId: yup.string().required('Divisi wajib diisi!'),
  dateRkh: yup.string().required('Tanggal wajib diisi!'),
})

export default function RKHForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id || item?.tempId)
  const year = route.params?.year
  const month = route.params?.month
  const organizationId = item?.division?.organization?.id || route.params?.organizationId
  const divisionId = item?.division?.id || route.params?.divisionId

  const {formRKHStatus} = useSelector((state: RootStateType) => state.rkh)
  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organizationId)
  const divisionAll = useSelector((state: RootStateType) => state.division.divisionAll?.data || [])
  const selectedDivision = divisionAll.find(e => e.id === divisionId)

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty, isSubmitting},
    setValue,
    getValues,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      organizationId,
      divisionId,
      dateRkh: item?.dateRkh ? moment(new Date(item.dateRkh).toString()).format('YYYY-MM-DD') : '',
    },
  })

  useEffect(() => {
    const error = formRKHStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formRKHStatus?.error])

  useEffect(() => {
    const data = formRKHStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(
        `${isEdit ? data?.response?.numberRkh || item?.numberRkh + ' berhasil diperbarui' : 'Berhasil dibuat'}`,
      )
      //@ts-ignore
      navigation.navigate(Routes.RKH_LIST, {...route?.params})
    }
  }, [formRKHStatus?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getRKHDetail.request({loading: true, data: item.id}))
    }
    dispatch(actions.clearFormRKHStatus())
  }, [])

  const onSubmit = (data: IRKHFormData) => {
    Object.assign(data, {division: selectedDivision})
    if (isEdit) {
      dispatch(actions.editRKH.request({loading: true, data: data}))
      return
    }
    dispatch(actions.createRKH.request({loading: true, data: data}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah RKH' : 'Tambah RKH'} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SelectInput
            disabledText={selectedDivision?.organization?.name}
            disabled
            items={organizations}
            control={control}
            label="Organisasi"
            placeholder="Pilih Organisasi"
            name="organizationId"
            key="organizationId"
            errorText={errors?.organizationId?.message}
            isRequired
          />
          <SelectInput
            disabledText={selectedDivision?.name}
            items={divisions}
            control={control}
            label="Kode Divisi"
            placeholder="Pilih Divisi"
            name="divisionId"
            key="divisionId"
            errorText={errors?.divisionId?.message}
            disabled
            isRequired
          />

          <DatePicker
            // value={new Date(getValues('dateRkh')).toISOString()}
            name="dateRkh"
            control={control}
            label="Tanggal Panen"
            placeholder="Pilih tanggal"
            errorText={errors?.dateRkh?.message}
            isRequired={true}
            minimumDate={new Date(year, parseInt(month) - 1, 1)}
            maximumDate={new Date(year, parseInt(month), 0)}
            onChangeText={value => {
              setValue('dateRkh', value, {
                shouldValidate: true,
              })
            }}
          />
        </ScrollView>
        <View style={{position: 'absolute', bottom: 6, flex: 1, width: '100%', alignSelf: 'center'}}>
          <Button disabled={Boolean(isSubmitting)} onPress={handleSubmit(onSubmit)}>
            <Text color="white">{formRKHStatus?.loading ? 'Loading...' : isEdit ? 'Ubah RKH' : 'Tambah RKH'}</Text>
          </Button>
        </View>
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
  addBlockButton: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addBlockButtonText: {
    color: theme.colors.white,
  },
  wrapButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
})
