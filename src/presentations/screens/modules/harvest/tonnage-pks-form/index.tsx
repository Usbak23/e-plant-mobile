import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { Button, DatePicker, Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from './styles'
import * as schema from '@utils/validation/tonnage-pks-form-validation'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { useForm, useWatch } from 'react-hook-form'
import { useItemOptions } from '@app/domain/states/item/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootStateType } from '@app/domain/states/store'
import { useTonnageGardenByItemId, useTonnageGardenWithoutPKSByItemId } from '@app/domain/states/tonnage-garden/hooks'
import { ITonnageGardenRow } from '@app/models/eplant/TonnageGarden'
import { ISPBListRow, ITonnagePKSFormData } from '@app/models/eplant/TonnagePKS'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useNavigation, useRoute } from '@react-navigation/native'
import { dateFormatter } from '@app/presentations/utils/dateFormatter'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'

const TonnagePKSForm = () => {
  const route: any = useRoute()
  const item = route?.params?.item
  const isEdit = Boolean(item)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.tonnagePksFormListValidationSchema)

  const organizations = useOrganizationOptions()
  const spbs = useSelector((state: RootStateType) => state?.tonnagePKS?.spbs?.data || [])

  const constructNettoFirst = () => {
    const temp = parseFloat(item.grossWeight) - parseFloat(item.tareWeight)
    return isNaN(temp) || temp == undefined || temp < 0 ? '' : temp.toFixed(2).toString()
  }

  const constructNettoSecond = () => {
    const netto1 = constructNettoFirst()
    const temp = parseFloat(netto1) - item.refraksi / 100
    return isNaN(temp) || temp == undefined || temp < 0 ? '' : temp.toFixed(2).toString()
  }

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      gardenTonnageId: isEdit ? item?.gardenTonnage?.id : '',
      date: isEdit ? dateFormatter(item?.date) : '',
      itemId: isEdit ? item?.item?.id : '',
      decision: isEdit ? item?.decision : 'Diterima',
      grossWeight: isEdit && item?.decision == 'Diterima' ? item?.grossWeight.toString() : '',
      tareWeight: isEdit && item?.decision == 'Diterima' ? item?.tareWeight.toString() : '',
      nettoFirst: isEdit && item?.decision == 'Diterima' ? constructNettoFirst() : '0',
      refraksi: isEdit && item?.decision == 'Diterima' ? item?.refraksi?.toString() : '',
      refraksiKg: isEdit && item?.decision == 'Diterima' ? item?.refraksiKg?.toString() : '',
      nettoSecond: isEdit && item?.decision == 'Diterima' ? constructNettoSecond() : '0',
      tenera: isEdit && item?.decision == 'Diterima' ? item?.tenera.toString() : '',
      dura: isEdit && item?.decision == 'Diterima' ? item?.dura.toString() : '',
      total: isEdit && item?.decision == 'Diterima' ? item?.total.toString() : '',
      halfRipe: isEdit && item?.decision == 'Diterima' ? item?.halfRipe.toString() : '',
      raw: isEdit && item?.decision == 'Diterima' ? item?.raw.toString() : '',
      abnormal: isEdit && item?.decision == 'Diterima' ? item?.abnormal.toString() : '',
      peram: isEdit && item?.decision == 'Diterima' ? item?.peram.toString() : '',
      jangkos: isEdit && item?.decision == 'Diterima' ? item?.jangkos.toString() : '',
      rottenLooseFruit: isEdit && item?.decision == 'Diterima' ? item.rottenLooseFruit.toString() : '',
      rubbish: isEdit && item?.decision == 'Diterima' ? item.rubbish.toString() : '',
      lateRipe: isEdit && item?.decision == 'Diterima' ? item.lateRipe.toString() : '',
      longStalk: isEdit && item?.decision == 'Diterima' ? item.longStalk : '',
      etc: isEdit && item?.decision == 'Diterima' ? item?.etc : '',
      fruitReturned: isEdit && item?.decision == 'Diterima' ? item.fruitReturned.toString() : '',
      //phase3
      organizationId: isEdit ? item?.organization?.id : '',
      driver: isEdit ? item?.spb?.po?.driver : '',
      janjang: isEdit && item?.decision == 'Diterima' ? item?.janjang ? item?.janjang?.toString() : '' : '',
      bjr: isEdit && item?.decision == 'Diterima' ? item?.bjr ? item?.bjr?.toString() : '' : '',
      spbId: isEdit ? item?.spb?.id : ''
    },
  })

  const organizationIdWatcher = useWatch({
    control: control,
    name: 'organizationId',
    defaultValue: control._defaultValues.organizationId || ''
  })

  const formStatus = useSelector((state: RootStateType) => state.tonnagePKS?.formTonnagePKSStatus)
  const [selectedSPB, setSelectedSPB] = useState<string | undefined>(
    item?.spb?.id || undefined,
  )
  const [selectedItemId, setSelectedItemId] = useState(isEdit ? item?.item?.id : '')
  const [selectedDecision, setSelectedDecision] = useState(isEdit ? item.decision : 'Diterima')
  const tonnageGardensPODO = useTonnageGardenWithoutPKSByItemId(selectedItemId)
  const items = useItemOptions('Kendaraan', organizationIdWatcher, true) //filter by organization


  const shouldConcatGardenTonnage = () => {
    if (item?.item?.id == selectedItemId) {
      return tonnageGardensPODO.concat({
        ...item?.gardenTonnage,
        item: item?.item,
        driver: item?.driver,
      })
    }
    return tonnageGardensPODO
  }
  const driverInfo = spbs?.find(spb => spb?.id == selectedSPB)?.driver || '-'

  const janjangWatcher = useWatch({
    control: control,
    name: 'janjang',
    defaultValue: control._defaultValues.janjang || ''
  })

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

  const refractionKgWatcher = useWatch({
    control: control,
    name: 'refraksiKg',
    defaultValue: control._defaultValues.refraksiKg || '',
  })


  const resetOptionalForm = () => {
    reset({
      grossWeight: '0',
      tareWeight: '0',
      nettoFirst: '0',
      nettoSecond: '0',
      refraksi: '0',
      refraksiKg: '0',
      tenera: '0',
      dura: '0',
      total: '0',
      halfRipe: '0',
      raw: '0',
      abnormal: '0',
      peram: '0',
      jangkos: '0',
      rottenLooseFruit: '0',
      rubbish: '0',
      lateRipe: '0',
      longStalk: null,
      etc: null,
      fruitReturned: '0',

      //below is not resetted
      gardenTonnageId: isEdit ? item?.gardenTonnage?.id : '',
      date: isEdit ? dateFormatter(item?.date) : '',
      driver: isEdit ? item?.driver : '',
      itemId: isEdit ? item?.item?.id : '',
      decision: 'Ditolak',

      //below is on phase3
      organizationId: '',
      janjang: '',
      bjr: '',
      spbId: ''
    })
    setSelectedSPB('')
    setSelectedItemId('')
  }

  const onSubmit = (form: ITonnagePKSFormData) => {
    setError('refraksiKg', null)
    if (form.refraksiKg > form.grossWeight - form.tareWeight) {
      showErrorToast('Refraksi (Kg) tidak boleh melebihi Netto 1')
      setError(
        'refraksiKg',
        {
          type: 'number',
          message: 'Refraksi (Kg) tidak boleh melebihi berat Netto 1',
        },
        {
          shouldFocus: true,
        },
      )
      return
    }
    form.nettoFirst = form.grossWeight - form.tareWeight
    form.nettoSecond = +(form.nettoFirst - (form.nettoFirst * form.refraksi) / 100).toFixed(2)
    form.refraksi = (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100
    form.bjr = (+(form.nettoFirst) / +(form.janjang)).toFixed(2)

    if (isEdit) {
      form.id = item.id
      dispatch(actions.updateTonnagePKS.request({ loading: true, data: form }))
      return
    }
    dispatch(actions.createTonnagePKS.request({ loading: true, data: form }))
  }


  useEffect(() => {
    const error = formStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formStatus?.error])

  useEffect(() => {
    const data = formStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('Berhasil disimpan')
      setTimeout(() => {
        navigation.goBack()
      }, 800)
    }
  }, [formStatus?.data?.data])


  useEffect(() => {
    if (organizationIdWatcher != '') {
      dispatch(actions.getSPBAll.request({ loading: true, data: { organizationId: organizationIdWatcher } }))
    }

  }, [organizationIdWatcher])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Tonase PKS' : 'Tambah Tonase PKS'} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text type="bold" style={{ marginVertical: 8 }}>
          Informasi Umum
        </Text>

        <SelectInput
          isRequired
          hideLabel={true}
          control={control}
          name="organizationId"
          items={organizations}
          onChange={v => {
            setSelectedItemId('')
            setSelectedSPB('')
          }}
        />

        <View style={styles.rowContainer}>
          <View style={{ flex: 1, marginEnd: 2 }}>
            <SelectInput
              control={control}
              label="No. Kendaraan"
              placeholder="Contoh: 1203"
              name="itemId"
              errorText={errors?.itemId?.message}
              isRequired
              items={items}
              onChange={v => setSelectedItemId(v)}
            />
          </View>
          <View style={{ flex: 1, marginStart: 2 }}>
            <SelectInput
              isRequired
              // items={shouldConcatGardenTonnage().map((t: ITonnageGardenRow) => ({ label: t.poNumber, value: t.id }))}
              items={!spbs || !selectedItemId ? [] : spbs?.filter(spb => spb?.item?.id == selectedItemId)?.map(spb => ({ label: spb?.po?.poNumber, value: spb?.id }))}
              labelMaxLine={1}
              control={control}
              label="No. Nota (PO/DO) SPB"
              placeholder="Pilih No. Nota (PO/DO) SPB"
              name="spbId"
              errorText={errors?.gardenTonnageId?.message}
              onChange={v => {
                setSelectedSPB(v)
                const driver =
                  shouldConcatGardenTonnage().find((garden: ITonnageGardenRow) => garden.id == v)?.driver || '-'
                setValue('driver', driver)
              }}
            />
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={{ flex: 1, marginEnd: 2 }}>
            {/* <TextInput
              maxLines={1}
              control={control}
              label="No. Nota (PO/DO) PKS"
              placeholder="Contoh: 1203"
              name="poNumberPks"
              errorText={errors?.poNumberPks?.message}
              isRequired
            /> */}
            <TextInput
              maxLines={1}
              disabled
              disabledText={driverInfo}
              control={control}
              label="Supir"
              placeholder="Contoh: 1203"
              name="driver"
              errorText={errors?.driver?.message}
              isRequired
            />
          </View>
          <View style={{ flex: 1, marginStart: 2 }}>
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

        <SelectInput
          labelMaxLine={1}
          isRequired
          items={[
            { label: 'Diterima', value: 'Diterima' },
            { label: 'Ditolak', value: 'Ditolak' },
          ]}
          control={control}
          label="Keputusan"
          placeholder="Pilih Keputusan"
          name="decision"
          errorText={errors?.decision?.message}
          onChange={v => {
            setSelectedDecision(v)
            if (v == 'Ditolak') {
              resetOptionalForm()
            }
          }}
        />

        {selectedDecision == 'Diterima' && (
          <>
            <Text type="bold" style={{ marginBottom: 8, marginTop: 18 }}>
              Berat
            </Text>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  isNumber
                  isFloat={true}
                  maxLines={1}
                  control={control}
                  label="Berat Gross (Kg)"
                  placeholder="Contoh: 3000"
                  name="grossWeight"
                  errorText={errors?.grossWeight?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  isNumber
                  isFloat
                  maxLines={1}
                  control={control}
                  label="Berat Tare (Kg)"
                  placeholder="Contoh: 1000"
                  name="tareWeight"
                  errorText={errors?.tareWeight?.message}
                  isRequired
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 4 }}>
                <TextInput
                  maxLines={1}
                  disabled
                  disabledText={
                    isNaN(grossWeightWatcher - tareWeightWatcher) || grossWeightWatcher - tareWeightWatcher < 0
                      ? ''
                      : (grossWeightWatcher - tareWeightWatcher).toString()
                  }
                  control={control}
                  label="Netto 1 (Kg)"
                  placeholder="Contoh: 100"
                  name="nettoFirst"
                  errorText={errors?.nettoFirst?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  maxLines={1}
                  control={control}
                  label="Refraksi (Kg)"
                  placeholder="Contoh: 100"
                  name="refraksiKg"
                  isNumber
                  isFloat={true}
                  errorText={errors?.refraksiKg?.message}
                  isRequired
                  onChangeText={v => {
                    if (
                      (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100 < 0 ||
                      (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100 > 100 ||
                      isNaN((refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100) ||
                      !isFinite((refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100)
                    ) {
                      setValue('refraksi', '0', { shouldValidate: true })
                    } else {
                      const res = (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100
                      setValue('refraksi', res.toFixed(2), { shouldValidate: true })
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  disabled
                  disabledText={
                    (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100 < 0 ||
                      (refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100 > 100 ||
                      isNaN((refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100) ||
                      !isFinite((refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100)
                      ? '-'
                      : parseFloat((refractionKgWatcher / (grossWeightWatcher - tareWeightWatcher)) * 100).toFixed(2)
                  }
                  maxLines={1}
                  control={control}
                  label="Refraksi (%)"
                  placeholder="Contoh: 300"
                  name="refraksi"
                  errorText={errors?.refraksi?.message}
                  isRequired
                  isNumber
                  isFloat
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  disabled
                  maxLines={1}
                  disabledText={
                    parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher) - parseFloat(refractionKgWatcher) <
                      0 ||
                      isNaN(
                        parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher) - parseFloat(refractionKgWatcher),
                      ) ||
                      !isFinite(
                        parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher) - parseFloat(refractionKgWatcher),
                      )
                      ? '-'
                      : (
                        parseFloat(grossWeightWatcher) -
                        parseFloat(tareWeightWatcher) -
                        parseFloat(refractionKgWatcher)
                      )
                        .toFixed(2)
                        .toString()
                  }
                  control={control}
                  label="Netto 2 (Kg)"
                  placeholder="Contoh: 100"
                  name="nettoSecond"
                  errorText={errors?.nettoSecond?.message}
                  isRequired
                // onChangeText={v => {
                //   onRefractionChanges()
                // }}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  maxLines={1}
                  control={control}
                  label="Janjang"
                  placeholder="Contoh: 100"
                  name="janjang"
                  isNumber
                  isFloat={true}
                  errorText={errors?.janjang?.message}
                  isRequired
                  onChangeText={v => { }}
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  disabled
                  maxLines={1}
                  disabledText={
                    (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) / parseFloat(janjangWatcher) <
                      0 ||
                      isNaN(
                        (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) / parseFloat(janjangWatcher)
                      ) ||
                      !isFinite(
                        (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) / parseFloat(janjangWatcher)
                      )
                      ? '-'
                      : (
                        (parseFloat(grossWeightWatcher) - parseFloat(tareWeightWatcher)) / parseFloat(janjangWatcher)
                      )
                        .toFixed(2)
                        .toString()
                  }
                  control={control}
                  label="BJR"
                  placeholder="Contoh: 100"
                  name="bjr"
                  errorText={errors?.bjr?.message}
                  isRequired

                />
              </View>
            </View>

            <Text type="bold" style={{ marginBottom: 8, marginTop: 18 }}>
              Kualitas
            </Text>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  maxLines={1}
                  control={control}
                  label="Tenera (Jjg)"
                  placeholder="Contoh: 0"
                  name="tenera"
                  errorText={errors?.tenera?.message}
                  isRequired
                  isNumber
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  maxLines={1}
                  control={control}
                  label="Dura (Jjg)"
                  placeholder="Contoh: 0"
                  name="dura"
                  errorText={errors?.dura?.message}
                  isRequired
                  isNumber
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  maxLines={1}
                  control={control}
                  label="Total (Jjg)"
                  placeholder="Contoh: 0"
                  name="total"
                  errorText={errors?.total?.message}
                  isRequired
                  isNumber
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>

            <Text type="bold" style={{ marginBottom: 8, marginTop: 18 }}>
              TBS Retur
            </Text>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={false}
                  control={control}
                  label="Mengkal (Jjg)"
                  placeholder="Contoh: 0"
                  name="halfRipe"
                  errorText={errors?.halfRipe?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={false}
                  control={control}
                  label="Mentah (Jjg)"
                  placeholder="Contoh: 0"
                  name="raw"
                  errorText={errors?.raw?.message}
                  isRequired
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  isNumber
                  maxLines={1}
                  isFloat={false}
                  control={control}
                  label="Abnormal (Jjg)"
                  placeholder="Contoh: 0"
                  name="abnormal"
                  errorText={errors?.abnormal?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={false}
                  control={control}
                  label="Peram (Jjg)"
                  placeholder="Contoh: 0"
                  name="peram"
                  errorText={errors?.peram?.message}
                  isRequired
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={false}
                  control={control}
                  label="Jangkos (Jjg)"
                  placeholder="Contoh: 0"
                  name="jangkos"
                  errorText={errors?.jangkos?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  isNumber
                  maxLines={1}
                  isFloat={false}
                  control={control}
                  label="Brondolan Busuk (Kg)"
                  placeholder="Contoh: 0"
                  name="rottenLooseFruit"
                  errorText={errors?.rottenLooseFruit?.message}
                  isRequired
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginEnd: 2 }}>
                <TextInput
                  isNumber
                  maxLines={1}
                  isFloat={false}
                  control={control}
                  label="Sampah (Kg)"
                  placeholder="Contoh: 0"
                  name="rubbish"
                  errorText={errors?.rubbish?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginStart: 2 }}>
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={true}
                  control={control}
                  label="Lewat Matang (Jjg)"
                  placeholder="Contoh: 0"
                  name="lateRipe"
                  errorText={errors?.lateRipe?.message}
                  isRequired
                />
              </View>
            </View>

            <Text type="bold" style={{ marginBottom: 8, marginTop: 18 }}>
              Lain-Lain
            </Text>

            <View style={styles.body}>
              <View style={{ flex: 1, marginEnd: 4 }}>
                <SelectInput
                  labelMaxLine={1}
                  isRequired
                  items={[
                    { label: 'Panjang', value: 'Panjang' },
                    { label: 'Pendek', value: 'Pendek' },
                  ]}
                  control={control}
                  label="Tangkai"
                  placeholder="Pilih Tangkai"
                  name="longStalk"
                  errorText={errors?.longStalk?.message}
                  onChange={v => setValue('longStalk', v)}
                />
                <TextInput
                  maxLines={1}
                  isNumber
                  isFloat={false}
                  control={control}
                  label="Buah Dipulangkan"
                  placeholder="Contoh: 0"
                  name="fruitReturned"
                  errorText={errors?.fruitReturned?.message}
                  isRequired
                />
              </View>
              <View style={{ flex: 1, marginEnd: 4 }}>
                <SelectInput
                  labelMaxLine={1}
                  isRequired
                  items={[
                    {
                      label: 'Restan',
                      value: 'Restan',
                    },
                    {
                      label: 'Basah',
                      value: 'Basah',
                    },
                    {
                      label: 'Pasir',
                      value: 'Pasir',
                    },
                    {
                      label: 'Kotor',
                      value: 'Kotor',
                    },
                  ]}
                  control={control}
                  label="Lain-Lain"
                  placeholder="Pilih Lain-Lain"
                  name="etc"
                  errorText={errors?.etc?.message}
                  onChange={v => setValue('etc', v)}
                />
                <View />
              </View>
            </View>
          </>
        )}

        <Button disabled={Boolean(formStatus?.loading)} style={{ marginVertical: 16 }} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah Tonase PKS' : 'Simpan Tonase PKS'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TonnagePKSForm
