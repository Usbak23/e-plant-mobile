import {theme} from '@app/presentations/utils/styles'
import {Button, DatePicker, Header, Loader, SelectInput, Text, TextInput} from '@app/presentations/_shared-components'
import {useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import * as yup from 'yup'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useForm} from 'react-hook-form'
import {IItemRow} from '@app/models/eplant/Item'
import {useSubActivityOptions, useSubActivityOptionsCode} from '@app/domain/states/subactivity/hooks'
import {useUomOptions} from '@app/domain/states/master/hooks'
import IOption from '@app/models/commons/IOption'
import {useCurrentUserInfo} from '@app/domain/states/user/hooks'
import ModalMaterial from './modal-material'
import {IMaintenance, IMaintenanceMaterial, IMaintenanceMaterialForm} from '@app/models/eplant/Maintenance'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import numberWithDot from '@app/presentations/utils/numberWithDot'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'

const schema = yup.object().shape({
  date: yup.string().required('Tanggal harus diisi').typeError('Tanggal harus diisi'),
  timeStart: yup.string().required('Waktu mulai harus diisi').typeError('Waktu mulai harus diisi'),
  timeEnd: yup.string().required('Waktu berakhir harus diisi').typeError('Waktu berakhir harus diisi dengan benar'),
  subActivityId: yup.string().required('Sub Activity harus diisi').typeError('Sub Activity harus diisi'),
  description: yup.string().required('Deskripsi harus diisi').typeError('Deskripsi harus diisi'),
})

const MaintenanceForm = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const user = useCurrentUserInfo()
  const item: IItemRow | undefined = route?.params?.item
  const maintenance: IMaintenance | undefined = route?.params?.maintenance
  const isEdit = Boolean(maintenance)
  const resolver = useYupValidationResolver(schema)

  const constructMaterialForEdit = (passedMaterials = []): IMaintenanceMaterialForm[] => {
    return (
      passedMaterials?.map((m: IMaintenanceMaterial) => {
        const maintenanceInForm: IMaintenanceMaterialForm = {
          materialName: m.material?.name,
          materialId: m?.material?.id,
          price: m?.price,
          qty: m?.qty,
          uomId: m?.uom?.id,
          totalPrice: m?.totalPrice,
        }
        return maintenanceInForm
      }) || []

      // maintenance?.materials?.map((m: IMaintenanceMaterial) => {
      //   const maintenanceInForm: IMaintenanceMaterialForm = {
      //     materialName: m.material?.name,
      //     materialId: m?.material?.id,
      //     price: m?.price,
      //     qty: m?.qty,
      //     uomId: m?.uom?.id,
      //     totalPrice: m?.totalPrice,
      //   }
      //   return maintenanceInForm
      // }) || []
    )
  }

  const subActivities = useSubActivityOptionsCode()
  const subs = useSubActivityOptions()

  const [selectedSubActivity, setSelectedSubActivity] = useState(isEdit ? maintenance?.subActivity?.id : '')
  const [modalMaterial, setModalMaterial] = useState(false)

  const [attachedMaterials, setAttachedMaterials] = useState<IMaintenanceMaterialForm[]>([]
    // isEdit ? constructMaterialForEdit() : [],
  )
  const {formMaintenanceStatus, maintenanceDetail} = useSelector((state: RootStateType) => state.maintenanceReducer)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: {errors, isValid, isDirty},
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      date: isEdit ? maintenance?.date : '',
      timeStart: isEdit ? `${maintenance?.time.split('-')[0]}` : '',
      timeEnd: isEdit ? `${maintenance?.time.split('-')[1]}` : '',
      subActivityId: isEdit ? maintenance?.subActivity?.id : '',
      description: isEdit ? maintenance?.description : '',
    },
  })

  const onSubmit = (form: any) => {
    const start = parseInt(form.timeStart.replace(':', ''))
    const end = parseInt(form.timeEnd.replace(':', ''))
    if (start >= end) {
      showErrorToast('Waktu mulai harus lebih kecil dari waktu berakhir')
      return
    }
    Object.assign(form, {
      itemId: item?.id,
      materials: attachedMaterials || [],
      time: form.timeStart + '-' + form.timeEnd,
    })

    if (isEdit) {
      Object.assign(form, {
        id: maintenance?.id,
      })
      dispatch(actions.editMaintenance.request({loading: true, data: form}))
      return
    }

    dispatch(actions.createMaintenance.request({loading: true, data: form}))
  }

  useEffect(() => {
    if(isEdit){
      dispatch(actions.getMaintenanceDetail.request({loading: true, data: maintenance?.id}))
    }
  }, [])

  useEffect(() => {
    if(maintenanceDetail?.data?.materials && isEdit){
      const constructedMaterials = constructMaterialForEdit(maintenanceDetail?.data?.materials || [])
      setAttachedMaterials(constructedMaterials)
    }
  }, [maintenanceDetail?.data])

  useEffect(() => {
    const error = formMaintenanceStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formMaintenanceStatus?.error])

  useEffect(() => {
    const data = formMaintenanceStatus?.data?.data

    if (data?.code == '200') {
      showSuccessToast('Perubahan disimpan')
      navigation.goBack()
    }
  }, [formMaintenanceStatus?.data])

  return (
    <SafeAreaView style={styles.root}>
      <Header title={isEdit ? 'Ubah Maintenance' : 'Tambah Maintenance'} />
      <Loader loading={Boolean(formMaintenanceStatus?.loading || maintenanceDetail?.loading)} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.containerScroll}>
        <TextInput
          disabled={true}
          disabledText={item?.name || '-'}
          label="Item"
          placeholder="Item"
          control={control}
          name="itemName"
        />

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={maintenance?.date || '-'}
            label="Tanggal"
            placeholder="Tanggal"
            control={control}
            name="date"
          />
        ) : (
          <DatePicker
            name="date"
            control={control}
            label="Tanggal"
            placeholder="Pilih Tanggal Kegiatan"
            errorText={errors?.date?.message}
            isRequired={true}
            onChangeText={value => {
              setValue('date', value, {
                shouldValidate: true,
              })
            }}
          />
        )}

        {isEdit ? (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'column', marginEnd: 8}}>
              <TextInput
                disabled={true}
                disabledText={getValues('timeStart') || '-'}
                label="Waktu Awal"
                placeholder="Waktu Awal Kegiatan"
                control={control}
                name="timeStart"
              />
            </View>

            <View style={{flex: 1, flexDirection: 'column', marginStart: 8}}>
              <TextInput
                disabled={true}
                disabledText={getValues('timeEnd') || '-'}
                label="Waktu Akhir"
                placeholder="Waktu Akhir Kegiatan"
                control={control}
                name="timeEnd"
              />
            </View>
          </View>
        ) : (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, flexDirection: 'column', marginEnd: 8}}>
              <DatePicker
                style={{width: '50%'}}
                timeOnly
                name="timeStart"
                control={control}
                label="Waktu Awal"
                placeholder="Pilih Waktu Kegiatan"
                errorText={errors?.timeStart?.message}
                isRequired={true}
                onChangeText={function (value: string): void {
                  setValue('timeStart', value)
                }}
              />
            </View>

            <View style={{flex: 1, flexDirection: 'column', marginStart: 8}}>
              <DatePicker
                style={{width: '50%'}}
                timeOnly
                name="timeEnd"
                control={control}
                label="Waktu Akhir"
                placeholder="Pilih Waktu Kegiatan"
                errorText={errors?.timeEnd?.message}
                isRequired={true}
                onChangeText={function (value: string): void {
                  setValue('timeEnd', value)
                }}
              />
            </View>
          </View>
        )}

        {isEdit ? (
          <TextInput
            disabled={true}
            disabledText={maintenance?.subActivity?.accountNumber || '-'}
            label="Sub Aktivitas"
            placeholder="Kode Sub Aktivitas"
            control={control}
            name="subActivityId"
          />
        ) : (
          <SelectInput
            isRequired={true}
            items={subActivities}
            control={control}
            label="Kode Kegiatan"
            placeholder="Pilih Kode Kegiatan"
            name="subActivityId"
            errorText={errors.subActivityId?.message}
            onChange={v => {
              setSelectedSubActivity(v)
              setValue('subActivityId', v)
            }}
          />
        )}

        <TextInput
          disabled={true}
          disabledText={(subs || []).find((v: IOption) => v.value == selectedSubActivity)?.label || '-'}
          label="Nama Kegiatan"
          placeholder="Nama Kegiatan"
          control={control}
          name="subActivityName"
          isRequired
        />

        <TextInput
          isRequired
          multiline
          maxLines={5}
          label="Keterangan"
          placeholder="Contoh: Body tidak ada kerusakan"
          control={control}
          name="description"
          errorText={errors.description?.message}
        />

        <TextInput
          disabled={true}
          disabledText={user?.name || '-'}
          label="Karyawan"
          placeholder="Karyawan Pengaju"
          control={control}
          name="user"
          isRequired
        />

        <View style={styles.overview}>
          <View style={{flex: 1}}>
            <Text size={11}>Total Biaya</Text>
            <Text size={11} type="semibold">
              Rp. {numberWithDot((attachedMaterials.reduce((acc, curr) => acc + curr.totalPrice, 0) || 0).toFixed(2))}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Button onPress={() => setModalMaterial(true)}>
              <Text size={11} color="white">
                Tambah Material
              </Text>
            </Button>
          </View>
        </View>

        {attachedMaterials.map((v: IMaintenanceMaterialForm, i: number) => (
          <TouchableOpacity activeOpacity={0.5} style={styles.card} disabled={true} onPress={() => {}}>
            <View style={styles.header}>
              <View />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => {
                  const filtered = attachedMaterials.filter(
                    (x: IMaintenanceMaterialForm) => x.materialId !== v.materialId,
                  )
                  setAttachedMaterials(filtered)
                }}>
                <Icon name="delete-outline" size={24} color={theme.colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.wrapInfo}>
              <View style={styles.wrapLabelValue}>
                <Text color={theme.colors.label} size={11}>
                  Material
                </Text>
                <Text color={theme.colors.textThinBlack} size={12}>
                  {v.materialName || '-'}
                </Text>
              </View>
              <View style={styles.wrapLabelValue}>
                <Text color={theme.colors.label} size={11}>
                  Kuantitas
                </Text>
                <Text color={theme.colors.textThinBlack} size={12}>
                  {v.qty != undefined ? v.qty : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.wrapInfo}>
              <View style={styles.wrapLabelValue}>
                <Text color={theme.colors.label} size={11}>
                  Biaya Per Satuan
                </Text>
                <Text color={theme.colors.textThinBlack} size={12}>
                  Rp{numberWithDot(v.price || 0)}
                </Text>
              </View>
              <View style={styles.wrapLabelValue}>
                <Text color={theme.colors.label} size={11}>
                  Total Biaya
                </Text>
                <Text color={theme.colors.textThinBlack} size={12}>
                  Rp{(numberWithDot(((v.price || 0) * v.qty).toFixed(2)) || 0)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Button onPress={handleSubmit(onSubmit)}>
          <Text color="white">Simpan</Text>
        </Button>
      </ScrollView>

      <ModalMaterial
        organizationId={item?.organization?.id}
        onHandleSubmit={v => {
          setModalMaterial(false)
          const found = attachedMaterials.find((v2: IMaintenanceMaterialForm) => v2.materialId == v.materialId)
          if (found) {
            showErrorToast('Material yang ditambahkan sudah ada. Perubahan dibatalkan')
            return
          }
          setAttachedMaterials([...attachedMaterials, v])
        }}
        onTouchOutside={() => {
          setModalMaterial(false)
        }}
        isOpen={modalMaterial}
      />
    </SafeAreaView>
  )
}

export default MaintenanceForm

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  containerScroll: {
    paddingBottom: 120,
  },
  overview: {
    marginVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.lightGrey,
    padding: 16,
    flex: 1,
    flexDirection: 'row',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginVertical: 7.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  removeBtn: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 8,
    padding: 8,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  menu: {padding: 13, margin: -13},
  wrapInfo: {flexDirection: 'row', marginTop: 15},
  wrapLabelValue: {flex: 1},
})
