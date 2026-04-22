import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { theme } from '@app/presentations/utils/styles'
import {
  AutoCompleteTextInput,
  Button,
  DatePicker,
  DisabledInput,
  Header,
  SelectInput,
  Text,
  TextInput,
} from '@app/presentations/_shared-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as schema from '@utils/validation/tonnage-garden-form-validation'
import TonnageBlockForm from './tonnage-block-form'
import { useItemOptions, useItemOptionsByOrganizationId } from '@app/domain/states/item/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { useUsersByOrganizationFull } from '@app/domain/states/user/hooks'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { IUserRow } from '@app/models/eplant/User'
import { useWatch, useFieldArray, useForm } from 'react-hook-form'
import { ITonnageGardenBlok, ITonnageGardenFormData } from '@app/models/eplant/TonnageGarden'
import { useBlockOptionsByOrganization } from '@app/domain/states/block/hooks'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useNavigation, useRoute } from '@react-navigation/native'
import { dateFormatter } from '@app/presentations/utils/dateFormatter'
import System from '@app/domain/services/System'

interface IBlockForm {
  blockId: string
  totalJanjang: string
}

const defaultBlockForm: IBlockForm = {
  blockId: '',
  totalJanjang: '',
}

const TonnageGardenForm = () => {
  const dispatch = useDispatch()
  const route: any = useRoute()
  const navigation: any = useNavigation()
  const resolver = useYupValidationResolver(schema.tonnageGardenFormValidationSchema)
  const draftResolver = useYupValidationResolver(schema.tonnageGardenDraftValidationSchema)
  const item = route?.params?.item
  const isEdit = Boolean(item)
  const isDraft = isEdit && item?.status === 'draft'

  const constructDefaultBlocks = (currentBlocks?: ITonnageGardenBlok[]) => {
    if (currentBlocks && Array.isArray(currentBlocks)) {
      if (currentBlocks.length == 0) {
        return [defaultBlockForm]
      }
      const temps: IBlockForm[] = []
      currentBlocks.forEach((element: ITonnageGardenBlok) => {
        temps.push({
          blockId: element?.block?.id || '',
          totalJanjang: element.totalJanjang.toString(),
        })
      })
      return temps
    }
    return [defaultBlockForm]
  }

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: isEdit && !isDraft ? resolver : draftResolver,
    mode: 'onChange',
    defaultValues: {
      poNumber: isEdit ? item?.poNumber : '',
      date: isEdit ? dateFormatter(item?.date) : '',
      organizationId: isEdit ? item?.organization?.id : '',
      driver: isEdit ? item?.driver : '',
      itemId: isEdit ? item?.item?.id : '',
      grossWeight: isEdit ? item.grossWeight.toString() : '',
      tareWeight: isEdit ? item.tareWeight.toString() : '',
      netto: isEdit ? item.netto.toString() : '0',
      gardenTonnageBlocks: [defaultBlockForm],
    },
  })

  const [selectedOrganization, setSelectedOrganization] = useState(isEdit ? item?.organization?.id : '')
  const organizations = useOrganizationOptions()
  const drivers = useUsersByOrganizationFull(selectedOrganization)
  const items = useItemOptionsByOrganizationId('Kendaraan', selectedOrganization)
  const blocks = useBlockOptionsByOrganization(selectedOrganization)

  const formStatus = useSelector((state: RootStateType) => state.tonnageGarden?.formTonnageGardenStatus)
  const tonnageGardenDetail = useSelector((state: RootStateType) => state.tonnageGarden?.tonnageGardenDetail)

  const grossWeightWatcher = useWatch({
    control: control,
    name: 'grossWeight',
    defaultValue: control._defaultValues.grossWeight || '',
  })

  const tareWeightWatcher = useWatch({
    control: control,
    name: 'tareWeight',
    defaultValue: control._defaultValues.tareWeight || '',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore
    name: 'gardenTonnageBlocks',
  })

  const gardenTonnageBlocksWatcher = useWatch({
    control: control,
    name: 'gardenTonnageBlocks',
    defaultValue: control._defaultValues?.gardenTonnageBlocks || [],
  })

  const calculateBJR = (): string => {
    const janjangKumulatif = gardenTonnageBlocksWatcher?.reduce((acc: any, obj: any) => (acc + parseInt(obj?.totalJanjang || 0)), 0) || 0
    const netto = isNaN(parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) ||
      parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher) < 0
      ? 0
      : (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher))
    const result = netto / janjangKumulatif
    return !result || isNaN(result) || !isFinite(result) ? '0' : result.toFixed(2).toString()
  }

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getTonnageGardenDetail.request({ loading: true, data: item.id }))
    }
    dispatch(actions.getItemAll.request({ loading: true }))
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllBlock.request({ loading: true }))
  }, [])

  useEffect(() => {
    const error = formStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formStatus?.error])

  useEffect(() => {
    const data = formStatus?.data?.data
    if (data?.status == 'success' || formStatus?.data?.status === 200) {
      showSuccessToast('Berhasil disimpan')
      setTimeout(() => {
        navigation.goBack()
      }, 200)
    }
  }, [formStatus?.data])

  useEffect(() => {
    if (isEdit && tonnageGardenDetail?.data?.id === item.id) {
      reset({
        poNumber: tonnageGardenDetail?.data?.poNumber,
        date: tonnageGardenDetail?.data?.date,
        organizationId: tonnageGardenDetail?.data?.organization?.id,
        driver: tonnageGardenDetail?.data?.driver,
        itemId: tonnageGardenDetail?.data?.item?.id,
        grossWeight: tonnageGardenDetail?.data?.grossWeight.toString(),
        tareWeight: tonnageGardenDetail?.data?.tareWeight?.toString(),
        netto: tonnageGardenDetail?.data?.netto?.toString(),
        gardenTonnageBlocks: constructDefaultBlocks(tonnageGardenDetail?.data?.gardenTonnageBlocks),
      })
    }
  }, [tonnageGardenDetail?.data])

  // Load blok dari BPBKS aggregate saat edit draft
  useEffect(() => {
    if (isDraft && item?.id) {
      System.instance.tonnageGarderService.getBpbksAggregate(item.id).then((res: any) => {
        const blocks = (res?.data?.response || []).map((b: any) => ({
          blockId: b.blockId,
          totalJanjang: b.totalJanjang?.toString() || '0',
        }))
        if (blocks.length > 0) {
          setValue('gardenTonnageBlocks', blocks)
        }
      }).catch(() => {})
    }
  }, [isDraft, item?.id])

  const buildForm = (form: ITonnageGardenFormData) => {
    const gross = parseFloat(form.grossWeight as any) || 0
    const tare = parseFloat(form.tareWeight as any) || 0
    form.grossWeight = gross
    form.tareWeight = tare
    form.netto = gross - tare
    form.janjang = form.gardenTonnageBlocks?.reduce((acc, obj) => (acc + parseInt(obj.totalJanjang.toString() || '0')), 0) || 0
    const bjr = form.netto / form.janjang
    form.bjr = !bjr || isNaN(bjr) || !isFinite(bjr) ? 0 : bjr
    return form
  }

  const onSubmit = async (form: ITonnageGardenFormData) => {
    if (!isEdit) {
      try {
        await schema.tonnageGardenFormValidationSchema.validate(form, { abortEarly: false })
      } catch (err: any) {
        showErrorToast(err.errors?.[0] || 'Validasi gagal')
        return
      }
    }
    form = buildForm(form)
    form.status = 'submitted'
    if (isEdit) {
      form.id = item.id
      dispatch(actions.updateTonnageGarden.request({ loading: true, data: form }))
      return
    }
    dispatch(actions.createTonnageGarden.request({ loading: true, data: form }))
  }

  const onSaveDraft = async () => {
    const form = getValues() as ITonnageGardenFormData
    const built = buildForm({ ...form })
    built.status = 'draft'
    built.gardenTonnageBlocks = []
    if (isEdit) {
      built.id = item.id
      dispatch(actions.updateTonnageGarden.request({ loading: true, data: built }))
    } else {
      dispatch(actions.createTonnageGarden.request({ loading: true, data: built }))
    }
    showSuccessToast('Draft berhasil disimpan')
    navigation.goBack()
  }
  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Tonase Kebun' : 'Tambah Tonase Kebun'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={{ flex: 1, marginEnd: 4 }}>
            <TextInput
              disabled={isEdit}
              disabledText={item?.poNumber}
              maxLines={1}
              style={{ marginTop: 5 }}
              control={control}
              label="No. Nota (PO/DO)"
              placeholder="Contoh: 1203"
              name="poNumber"
              errorText={errors?.poNumber?.message}
              isRequired
            />
          </View>
          <View style={{ flex: 1 }}>
            <DatePicker
              labelMaxLine={1}
              name="date"
              control={control}
              label="Tanggal"
              placeholder="Pilih Tanggal"
              errorText={errors?.date?.message}
              isRequired={true}
              onChangeText={value => {
                setValue('date', value, {
                  shouldValidate: true,
                })
              }}
            />
          </View>
        </View>

        <View style={styles.body}>
          <View style={{ flex: 1, marginEnd: 4 }}>
            <SelectInput
              disabled={isEdit}
              disabledText={item?.organization?.name || '-'}
              labelMaxLine={1}
              isRequired
              items={organizations}
              control={control}
              label="Organisasi"
              placeholder="Pilih Organisasi"
              name="organizationId"
              errorText={errors?.organizationId?.message}
              onChange={v => {
                setSelectedOrganization(v)
                setValue('organizationId', v)
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AutoCompleteTextInput
              control={control}
              name="driver"
              label="Supir"
              placeholder="Ketik nama supir"
              errorText={errors?.driver?.message}
              items={drivers.map((d: IUserRow) => d.name)}
              onChangeText={v => {
                setValue('driver', v)
              }}
            />
          </View>
        </View>

        <View style={styles.body}>
          <View style={{ flex: 1, marginEnd: 4 }}>
            <SelectInput
              labelMaxLine={1}
              isRequired
              items={items}
              control={control}
              label="No. Kendaraan"
              placeholder="Pilih Kendaraan"
              name="itemId"
              errorText={errors?.itemId?.message}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              maxLines={1}
              control={control}
              label="Berat Gross (Kg)"
              placeholder="Contoh: 1500"
              name="grossWeight"
              errorText={errors?.grossWeight?.message}
              isRequired
              isNumber
              isFloat
            />
          </View>
        </View>

        <View style={styles.body}>
          <View style={{ flex: 1, marginEnd: 4 }}>
            <TextInput
              maxLines={1}
              control={control}
              label="Berat Tare (Kg)"
              placeholder="Contoh: 400"
              name="tareWeight"
              errorText={errors?.tareWeight?.message}
              isRequired
              isNumber
              isFloat
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              maxLines={1}
              disabled
              disabledText={
                isNaN(parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) ||
                  parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher) < 0
                  ? '-'
                  : (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)).toFixed(2).toString()
              }
              control={control}
              label="Berat Netto"
              placeholder="Contoh: 1500"
              name="netto"
              errorText={errors?.netto?.message}
              isRequired
            />
          </View>
        </View>

        <View style={styles.body}>
          <View style={{ flex: 1, marginEnd: 4 }}>
            <DisabledInput
              maxLines={1}
              hideIcon
              label="Janjang"
              value={gardenTonnageBlocksWatcher?.reduce((acc: any, obj: any) => (acc + parseInt(obj?.totalJanjang || 0)), 0) || '-'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <DisabledInput
              maxLines={1}
              hideIcon
              label="BJR"
              value={calculateBJR()}
            />
          </View>
        </View>

        <View style={{ marginVertical: 16 }} />

        <Button
          style={{ alignSelf: 'flex-start', marginBottom: 16, marginTop: 20, height: 40 }}
          onPress={() => append(defaultBlockForm)}>
          <Text style={{ fontSize: 12 }} color="white">
            Tambah Blok
          </Text>
        </Button>

        {fields.map((f: any, i: number) => (
          <TonnageBlockForm
            blocks={blocks}
            key={f?.id}
            index={i}
            control={control}
            errors={errors}
            fields={fields}
            onDelete={() => {
              remove(i)
            }}
          />
        ))}

        {!isEdit && (
          <Button
            style={{ marginTop: 8, marginBottom: 4, backgroundColor: theme.colors.light2 }}
            onPress={onSaveDraft}>
            <Text color={theme.colors.accent}>Simpan Draft</Text>
          </Button>
        )}
        <Button style={{ marginVertical: 8 }} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isDraft ? 'Lengkapi & Simpan' : isEdit ? 'Ubah Tonase Kebun' : 'Simpan Tonase Kebun'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TonnageGardenForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.pureWhite,
  },
  scroll: {
    padding: 16,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
