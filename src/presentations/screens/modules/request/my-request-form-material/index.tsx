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
import {useSubActivityOptions} from '@app/domain/states/subactivity/hooks'
import {useBlockOptions} from '@app/domain/states/block/hooks'
import {useRawMaterialFull, useRawMaterialOptions} from '@app/domain/states/raw-material/hooks'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import IOption from '@app/models/commons/IOption'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {IMyRequest} from '@app/models/eplant/Request'
import {IMyRequestBlock} from '@app/models/eplant/MyRequest'
import {useWatch} from 'react-hook-form'

const blockSchema = yup.object().shape({
  blockId: yup.string().required('Harus diisi'),
  name: yup.string().required('Harus diisi'),
})

let validationSchema = yup.object().shape({
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  type: yup.string().required('Tipe wajib dipilih').typeError('Masukkan tipe dengan benar'),
  materialId: yup.string().required('Material wajib diipilih').typeError('Masukkan material dengan benar'),
  qty: yup
    .number()
    .min(1, 'Kuantitas minimal 1')
    .required('Kuantitas wajib diisi')
    .typeError('Masukkan kuantitas dengan benar'),
  purpose: yup.string().required('Tujuan wajib diisi').typeError('Masukkan tujuan dengan benar'),
  subActivityId: yup.string().required('Sub-Aktivitas wajib diisi').typeError('Masukkan sub-aktivitas dengan benar'),
  blockId: yup.array().of(blockSchema).required('Blok tidak boloh kosong').min(1, 'Blok wajib diisi minimal 1'),
})

const MyRequestFormMaterial = () => {
  const navigation: any = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const parent = route?.params?.parent
  const req: IMyRequest | undefined = route?.params?.request
  const isEdit = Boolean(req)
  const user = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)

  const subActivities = useSubActivityOptions()
  const blocks = useBlockOptions(parent?.division?.value)
  // const materials = useRawMaterialOptions(parent?.organization?.value)
  const materialFulls = useRawMaterialFull(parent?.organization?.value)
  const materials = materialFulls.map(m => ({label: m?.name, value: m?.id}))

  // console.log(JSON.stringify(materialFulls.map(m => ({qty: m.qty, label: m.name}))))

  // console.log(JSON.stringify(materialFulls))

  const {formMyRequestStatus, myRequesstDetail}: IRSRequests = useSelector(
    (state: RootStateType) => state?.requestReducer,
  )

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
      materialId: '',
      subActivityId: '',
      blockId: [],
      qty: isEdit ? req?.qty.toString() : '',
      purpose: isEdit ? req?.purpose : '',
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    //@ts-ignore
    name: 'blockId',
  })

  useEffect(() => {
    dispatch(actions.getSubActivityAll.request({loading: true}))
    dispatch(actions.getRawMaterialAll.request({loading: true}))
    dispatch(actions.getAllBlock.request({loading: true}))
    if (isEdit) {
      dispatch(actions.getMyRequestDetail.request({loading: true, data: req?.id}))
    }
  }, [])

  const constructBlocksForEdit = (bs: IMyRequestBlock[] = []) => {
    const temps: any = []
    bs.forEach((b: IMyRequestBlock) => {
      temps.push({blockId: b.block?.id, name: b.block?.code})
      // append({blockId: b.block?.id, name: b.block?.id})
    })
    return temps
  }

  useEffect(() => {
    if (isEdit) {
      const detail = myRequesstDetail?.data
      if (detail) {
        const bs = detail?.requestBlocks || []
        const temp = constructBlocksForEdit(bs)
        // setSelectedCatItem(detail?.item?.typeItem || '')

        reset({
          date: detail?.date,
          type: detail?.type,
          subActivityId: detail?.subActivity?.id || '',
          materialId: detail?.material?.id || '',
          blockId: temp,
          qty: detail?.qty?.toString() || '',
          purpose: detail?.purpose || '',
        })
      }
    }
  }, [myRequesstDetail?.data])

  const onSubmit = (form: any) => {
    if (fields.length === 0) {
      showErrorToast('Isi Blok terlebih dahulu')
      return
    }

    const blockIds = fields.map((field: {blockId: string; name: string}) => field.blockId)

    delete form?.block

    Object.assign(form, {
      divisionId: parent?.division?.value,
      blockId: blockIds,
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

  const materialtWatcher = useWatch({
    control: control,
    name: 'materialId',
    defaultValue: control._defaultValues.materialId,
  })

  const getQty = (): string => {
    return materialFulls.find(v => v.id == materialtWatcher)?.qty || '-'
  }

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

        <SelectInput
          errorText={errors?.subActivityId?.message}
          control={control}
          name={'subActivityId'}
          label="Sub Aktivitas"
          isRequired
          placeholder="Pilih Sub Aktivitas"
          items={subActivities}
        />

        <SelectInput
          errorText={errors?.blockId?.message}
          control={control}
          name={'block'}
          label="Blok"
          isRequired
          placeholder="Pilih Blok"
          items={blocks}
          onChange={(item: string) => {
            const found = fields.find((field: any) => field.blockId === item)
            if (!found) {
              const b = blocks.find((block: IOption) => block.value === item)
              append({blockId: b?.value, name: b?.label})
            }

            setValue('block', '')
          }}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fields.map((i: any, index: number) => (
            <View key={index} style={styles.containerChip}>
              <Text maxLines={1}>{i?.name || '-'}</Text>
              <TouchableOpacity style={{marginStart: 8}} onPress={() => remove(index)}>
                <Icon name={'close'} size={22} color={theme.colors.black} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <SelectInput
          errorText={errors?.materialId?.message}
          control={control}
          name={'materialId'}
          label="Nama Material"
          isRequired
          placeholder="Pilih Material"
          items={materials}
        />

        <TextInput
          disabled
          disabledText={getQty()}
          placeholder="Contoh: 10"
          label="Stok Saat Ini"
          control={control}
          name={'stock'}
        />

        <TextInput
          errorText={errors?.qty?.message}
          isRequired
          isFloat={false}
          isNumber={true}
          placeholder="Contoh: 10"
          label="Kuantitas"
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

export default MyRequestFormMaterial

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
