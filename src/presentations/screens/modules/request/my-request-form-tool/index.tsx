import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {useFieldArray} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import IOption from '@app/models/commons/IOption'
import {
  useItemOptions,
  useItemOptionsWithExcludeTypeItem,
  useItemOptionsWithMandatoryTypeItem,
} from '@app/domain/states/item/hooks'
import {showErrorToast, showInfoToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {IRSRequests} from '@app/domain/states/request/reducer'
import {IMyRequest} from '@app/models/eplant/Request'
import {IMyRequestBlock} from '@app/models/eplant/MyRequest'
import {typeItem} from '@app/models/eplant/Item'

const blockSchema = yup.object().shape({
  blockId: yup.string().required('Harus diisi'),
  name: yup.string().required('Harus diisi'),
})

let validationSchema = yup.object().shape({
  date: yup.string().required('Tanggal wajib diisi').typeError('Masukkan tanggal dengan benar'),
  type: yup.string().required('Tipe wajib dipilih').typeError('Masukkan tipe dengan benar'),
  itemType: yup.string().required('Jenis item wajib dipilih').typeError('Masukkan jenis item dengan benar'),
  itemId: yup.string().required('Item wajib diipilih').typeError('Masukkan item dengan benar'),
  qty: yup
    .number()
    .min(1, 'Kuantitas minimal 1')
    .required('Kuantitas wajib diisi')
    .typeError('Masukkan kuantitas dengan benar'),
  purpose: yup.string().required('Tujuan wajib diisi').typeError('Masukkan tujuan dengan benar'),
  blockId: yup.array().of(blockSchema).nullable(),
})

const TYPE_ITEMS: typeItem[] = ['Peralatan', 'Perlengkapan']
const categoryItems = TYPE_ITEMS.map(e => ({label: e, value: e}))

const MyRequestFormTool = () => {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const parent = route?.params?.parent
  const req: IMyRequest | undefined = route?.params?.request
  const isEdit = Boolean(req)
  const user = useCurrentUserInfo()
  const resolver = useYupValidationResolver(validationSchema)

  const blocks = useBlocksByDivisionStd(isEdit ? req?.division?.id : parent?.division?.value)
  const [selectedCatItem, setSelectedCatItem] = useState('')

  const items = useItemOptionsWithMandatoryTypeItem(
    selectedCatItem ? selectedCatItem : undefined,
    isEdit ? req?.division?.organization?.id : parent?.organization?.value,
  )

  //selector
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
      itemType: '',
      itemId: '',
      blockId: [],
      qty: isEdit ? req?.qty?.toString() : '',
      purpose: isEdit ? req?.purpose : '',
    },
  })

  const {fields, append, remove} = useFieldArray({
    control,
    //@ts-ignore
    name: 'blockId',
  })

  const onSubmit = (form: any) => {
    let blockIds = []
    if (fields.length === 0) {
      form.blockId = null
    } else {
      blockIds = fields.map((field: {blockId: string; name: string}) => field.blockId)
    }
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
        setSelectedCatItem(detail?.item?.typeItem || '')

        reset({
          date: detail?.date,
          type: detail?.type,
          itemId: detail?.item?.id || '',
          blockId: temp,
          qty: detail?.qty?.toString() || '',
          purpose: detail?.purpose || '',
          itemType: detail?.item?.typeItem || '',
        })
      }
    }
  }, [myRequesstDetail?.data])

  useEffect(() => {
    const error = formMyRequestStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formMyRequestStatus?.error])

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
          errorText={errors?.blockId?.message}
          control={control}
          name={'block'}
          label="Blok"
          placeholder="Pilih Blok"
          items={blocks}
          onChange={(item: string) => {
            console.log(item)
            if (item != '') {
              const found = fields.find((field: any) => field.blockId === item)
              if (!found) {
                const b = blocks.find((block: IOption) => block.value === item)
                append({blockId: b?.value, name: b?.label})
              }

              setValue('block', '')
            }
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
          value={selectedCatItem}
          errorText={errors?.itemType?.message}
          control={control}
          name={'itemType'}
          label="Jenis Item"
          isRequired
          placeholder="Pilih Jenis Item"
          items={categoryItems}
          onChange={v => {
            setSelectedCatItem(v)
            setValue('itemId', '', {shouldValidate: true})
          }}
        />

        <SelectInput
          errorText={errors?.itemId?.message}
          control={control}
          name={'itemId'}
          label="Nama Item"
          isRequired
          placeholder="Pilih Item"
          items={items}
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

export default MyRequestFormTool

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
