import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useFieldArray} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {actions, RootStateType} from '@app/domain/states/store'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {useDispatch, useSelector} from 'react-redux'
import {IMyRequest} from '@app/models/eplant/MyRequest'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'

let validationSchema = yup.object().shape({
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  type: yup.string().required('Tipe wajib dipilih').typeError('Masukkan tipe dengan benar'),
  qty: yup
    .number()
    .min(1, 'Minimum uang tidak boleh nol')
    .required('Nominal uang wajib diisi')
    .typeError('Masukkan nominal dengan benar'),
  purpose: yup.string().required('Tujuan wajib diisi').typeError('Masukkan tujuan dengan benar'),
})

const MyRequestFormCash = () => {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const parent = route?.params?.parent
  const req: IMyRequest | undefined = route?.params?.request
  const isEdit = Boolean(req)
  const user = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      date: isEdit ? req?.date : parent?.date,
      type: isEdit ? req?.type : parent?.type,
      qty: isEdit ? req?.qty.toString() : '',
      purpose: isEdit ? req?.purpose : '',
    },
  })

  const {formMyRequestStatus, myRequesstDetail}: IRSRequests = useSelector(
    (state: RootStateType) => state?.requestReducer,
  )

  const onSubmit = (form: any) => {
    Object.assign(form, {
      divisionId: parent?.division?.value,
    })

    if (isEdit) {
      Object.assign(form, {
        id: req?.id,
      })

      dispatch(actions.editMyRequest.request({loading: true, data: form}))
      return
    }

    dispatch(actions.createMyRequest.request({loading: true, data: form}))
  }

  useEffect(() => {
    const error = formMyRequestStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formMyRequestStatus?.error])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getMyRequestDetail.request({loading: true, data: req?.id}))
    }
  }, [])

  useEffect(() => {
    const data = formMyRequestStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast('Perubahan disimpan')
      if (isEdit) {
        navigation.goBack()
      } else {
        navigation.pop(2)
      }
    }
  }, [formMyRequestStatus?.data])

  useEffect(() => {
    if (isEdit) {
      const detail = myRequesstDetail?.data
      if (detail) {
        reset({
          date: detail?.date,
          type: detail?.type,
          qty: detail?.qty?.toString() || '',
          purpose: detail?.purpose || '',
        })
      }
    }
  }, [myRequesstDetail?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Permintaan' : 'Tambah Permintaan'} />
      <Loader loading={Boolean(formMyRequestStatus?.loading) || Boolean(myRequesstDetail?.loading)} />
      <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 156}}>
        <TextInput
          disabled={true}
          disabledText={parent?.organization?.label || '-'}
          label="Organisasi"
          control={{}}
          name={'organizationId'}
        />
        <TextInput
          disabled={true}
          disabledText={parent?.division?.label || '-'}
          label="Divisi"
          control={{}}
          name={'divisionId'}
        />
        <TextInput disabled={true} disabledText={user?.name || '-'} label="Pengaju" control={{}} name={'requesterId'} />

        <TextInput
          disabled={true}
          disabledText={!isEdit ? parent?.date || '-' : req?.date || '-'}
          label="Tanggal"
          control={{}}
          name={'date'}
        />

        <TextInput
          disabled={true}
          disabledText={isEdit ? req?.type || '-' : parent?.type || '-'}
          label="Tipe Permintaan"
          control={{}}
          name={'type'}
        />

        <TextInput
          isCurrency
          errorText={errors?.qty?.message}
          isRequired
          placeholder="Contoh: Rp. 500.000"
          label="Jumlah"
          control={control}
          name={'qty'}
        />
        <TextInput
          errorText={errors?.purpose?.message}
          multiline={true}
          isRequired
          maxLines={5}
          placeholder="Contoh: Mengikuti SOP Perusahaan dalam melakukan pekerjaan lapangan menggunakan helm keselamatan"
          label="Tujuan Permintaan"
          control={control}
          name={'purpose'}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Permintaan' : 'Tambah Permintaan'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyRequestFormCash

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  containerChip: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 6,
    marginHorizontal: 6,
  },
})
