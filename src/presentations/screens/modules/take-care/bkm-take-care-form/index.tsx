import { theme } from '@app/presentations/utils/styles'
import { Button, Header, SelectInput, Text, TextInput } from '@app/presentations/_shared-components'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { useNavigation } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTypeEmployeeOptionsBoronganHarian, useUsersByDivision, useUsersByOrganization } from '@app/domain/states/user/hooks'
import { actions, RootStateType } from '@domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useRoute } from '@react-navigation/native'
import * as schema from '@utils/validation/bkm-form-validation'
import { styles } from './style'
import { useBlockOptions } from '@app/domain/states/block/hooks'
import moment from 'moment'
import { useSupervisionOptions, useWorkStatusOptions } from '@app/domain/states/master/hooks'
import { checkIfDuplicateExists } from '@app/presentations/utils/check'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCard from './material-card'
import Routes from '@app/presentations/navigation/Routes'
import { IBKMTakeCareFormDataCreate, IBKMTakeCareFormDataUpdate } from '@app/models/eplant/BKMTakeCare'
import { useWatch } from 'react-hook-form'

const BKMForm = () => {
  const route: any = useRoute()
  const scrollViewRef: any = useRef()

  const item = route.params?.item
  let bkmData = route.params?.bkmData
  const bkmEmployees = route.params?.bkmEmployees
  const isEdit = Boolean(item?.id || item?.tempId)
  const __subAct = route.params?.subAct

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.bkmValidationSchema)
  const rawMaterialAll = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      date: bkmData?.date,
      supervisionId: item?.supervision?.id || item?.supervisionId,
      workStatusId: item?.workStatus?.id || item?.workStatusId,
      userId: item?.user?.id || item?.userId,
      organizationId: bkmData?.organization?.value,
      divisionId: bkmData?.division?.id,
      foremanId: bkmData?.foreman?.id,
      blockId: item?.bkmEmployees?.length && item?.bkmEmployees[0].block?.id,
      workResultHa: item?.bkmEmployees?.length && item?.bkmEmployees[0].workResultHa,
      hkAmount: item?.bkmEmployees?.length && item?.bkmEmployees[0].hkAmount,
      subActivityId: __subAct?.id,
      typeEmployee: item?.typeEmployee || '',
      wages: item?.wages || '',
    },
  })

  const [selectedUser, setSelectedUser] = useState(item?.user?.id || '')
  const [defaultBlocks, setDefaultBlock] = useState([])
  const [blockForm, setBlockForm] = useState([
    {
      blockId: item?.block?.id || item?.blockId,
      workResultHa: item?.workResultHa?.toString(),
      hkAmount: item?.hkAmount?.toString(),
      workStatusId: item?.workStatusId,
      supervisionId: item?.supervisionId,
      bkmMaterials:
        item?.bkmMaterials?.map((e: any) => ({
          ...e,
          materialId: e.materialId || e?.material?.id,
          name: e?.name || e?.material?.name,
          uom: rawMaterialAll?.find(m => m.id === e.materialId || e?.material?.id)?.uom
        })) || [],
    },
  ])

  const totalHkAmount = [...blockForm, ...defaultBlocks].reduce((acc, curr) => (acc += parseFloat(curr.hkAmount)), 0)

  const formBKMTakeCareStatus = useSelector((state: RootStateType) => state.bkmTakeCare.formBKMTakeCareStatus)
  const userAll = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  const user = userAll.find(e => e.id === selectedUser)
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  // const users = useUsersByOrganization(bkmData?.organization?.id)
  const users = useUsersByDivision(bkmData?.division?.id)
  const workStatuses = useWorkStatusOptions()
  const supervisions = useSupervisionOptions()
  const typeEmployeeOptions = useTypeEmployeeOptionsBoronganHarian()
  const blocks = useBlockOptions(bkmData?.division?.id)


  const typeEmployeeWatcher = useWatch({
    control: control,
    name: 'typeEmployee',
    defaultValue: control._defaultValues.typeEmployee || '',
  })

  useEffect(() => {
    if (!isEdit && selectedUser) {
      const data = bkmEmployees
        ?.filter((e: any) => e.userId === selectedUser || e?.user?.id === selectedUser)
        .map((e: any) => {
          return {
            blockId: e?.blockId || e?.block?.id,
            workResultHa: e?.workResultHa?.toString(),
            hkAmount: e?.hkAmount?.toString(),
            workStatusId: e?.workStatus?.id || e?.workStatusId,
            supervisionId: e?.supervision || e?.supervisionId,
            bkmMaterials: e?.bkmMaterials || [],
            viewOnly: true,
          }
        })
      setDefaultBlock(data)
    }
  }, [selectedUser])

  const validateBlock = () => {
    if (blockForm?.length === 0) {
      showErrorToast('Harap tambah block terlebih dahulu!')
      return false
    }
    const field = ['blockId', 'workResultHa', 'hkAmount']
    if (blockForm.some((e: any) => !field.every((f: string) => e[f]))) {
      showErrorToast('Harap lengkapi semua data blok!')
      return false
    }
    const allBlocks = [...blockForm, ...defaultBlocks].map((e: any) => e?.blockId)
    if (checkIfDuplicateExists(allBlocks)) {
      showErrorToast('Block Tidak boleh ada yang sama!')
      return false
    }
    if (totalHkAmount > 1) {
      showErrorToast('Jumlah Semua Hk tidak boleh lebih dari 1!')
      return false
    }
    const isWorkResultHaMoreThanBlockArea = blockForm.some((e: any) => {
      const blockArea = blockAll.find(b => b.id === e.blockId)?.blockArea || 0
      if (parseFloat(e?.workResultHa) > blockArea) {
        return true
      }
      return false
    })
    if (isWorkResultHaMoreThanBlockArea) {
      showErrorToast('Jumlah Hasil Kerja tidak boleh lebih dari Luas Blok!')
      return false
    }
    return true
  }
  const constructToFormDataCreate = (value: any) => {
    const data: IBKMTakeCareFormDataCreate = {
      ...value,
      foremanId: value.foremanId,
      // subActivity: __subAct,
      subActivity: __subAct,
      subActivityId: __subAct?.id,
      bkmEmployee: blockForm.map(e => {
        const workStatus = workStatuses.find(w => w.value === value.workStatusId)
        const supervision = supervisions.find(w => w.value === value.supervisionId)
        return {
          ...e,
          userId: selectedUser,
          block: blockAll.find(b => b.id === e.blockId),
          workStatus: {
            id: e.workStatusId,
            name: workStatus?.label,
          },
          supervision: {
            id: e.supervisionId,
            name: supervision?.label,
          },

          user: user,
          supervisionId: value.supervisionId,
          workStatusId: value.workStatusId,
          wages: value.wages,
          typeEmployee: value.typeEmployee,
          bkmMaterials: e?.bkmMaterials,
        }
      }),
    }
    return data
  }
  const constructToFormDataUpdate = (value: any) => {
    const data: IBKMTakeCareFormDataUpdate = {
      ...value,
      foremanId: value.foremanId,
      userId: selectedUser,
      user: user,
      blockId: blockForm[0].blockId,
      workResultHa: parseFloat(blockForm[0].workResultHa),
      hkAmount: parseFloat(blockForm[0].hkAmount),
      bkmMaterials: blockForm[0]?.bkmMaterials,
      wages: value.wages,
      typeEmployee: value.typeEmployee,
      subActivityId: __subAct?.id,
      subActivity: __subAct,
    }
    return data
  }

  const onSubmit = (value: any) => {
    if (!validateBlock()) {
      return
    }
    if (isEdit) {
      const requestBody = constructToFormDataUpdate(value)
      dispatch(actions.editBKMTakeCare.request({ loading: true, data: requestBody }))
      return
    }
    const requestBodyCreate = constructToFormDataCreate(value)

    dispatch(actions.createBKMTakeCare.request({ loading: true, data: requestBodyCreate }))
    return
  }

  const setFieldBlockForm = (index: number, field: any, value: any) => {
    const newBlockForm = blockForm.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    setBlockForm(newBlockForm)
  }

  useEffect(() => {
    dispatch(actions.clearFormBKMTakeCareStatus())
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getSupervisions.request({ loading: true }))
    dispatch(actions.getWorkStatus.request({ loading: true }))
  }, [])

  useEffect(() => {
    const error = formBKMTakeCareStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formBKMTakeCareStatus?.error])

  useEffect(() => {
    const data = formBKMTakeCareStatus?.data?.data
    if (data?.code == 200) {
      showSuccessToast(`${isEdit ? 'Berhasil diperbarui' : 'Berhasil disimpan'}`)
      setTimeout(() => {
        navigation.goBack()
      }, 800)
    }
  }, [formBKMTakeCareStatus?.data])

  const HeaderView = () => <Header title={isEdit ? 'Ubah BKM' : 'Tambah BKM'} />

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Row>
          <TextInput
            label="Tanggal BKM"
            control={control}
            name="date"
            disabled
            disabledText={moment(bkmData?.date).format('D MMMM YYYY')}
            value={bkmData?.date}
            isRequired
          />
          <TextInput
            label="Organisasi"
            control={control}
            name="organizationId"
            disabledText={bkmData?.organization?.label}
            value={bkmData?.organization?.value}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <TextInput
            label="Divisi"
            control={control}
            name="divisionId"
            disabledText={bkmData?.division?.name}
            value={bkmData?.division?.id}
            disabled
            isRequired
          />

          <TextInput
            errorText={errors?.subActivityId?.message}
            label="Sub Aktivitas"
            control={control}
            placeholder="Sub Aktivitas"
            name="subActivity"
            disabledText={__subAct?.name}
            value={__subAct?.id}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <TextInput
            label="Mandor"
            control={control}
            name="foremanId"
            disabledText={bkmData?.foreman?.name}
            value={bkmData?.foreman?.id}
            disabled
            isRequired
          />
          <SelectInput
            label="Nama Karyawan"
            placeholder="Contoh : Dedi"
            control={control}
            items={users}
            name="userId"
            disabled={isEdit}
            disabledText={item?.user?.name || user?.name}
            onChange={v => setSelectedUser(v)}
            isRequired
          />
        </Row>
        <Row>
          <TextInput
            label="Peran"
            control={control}
            placeholder="Karyawan Panen"
            name="role"
            disabledText={user?.role?.name || item?.role?.name}
            value={user?.role?.name}
            disabled
            isRequired
          />
          <SelectInput
            items={typeEmployeeOptions}
            label="Jenis Karyawan"
            control={control}
            name="typeEmployee"
            errorText={errors.typeEmployee?.message}
            isRequired
          />
        </Row>
        <Row>
          <SelectInput
            label="Supervisi"
            control={control}
            placeholder="Pilih Supervisi"
            name="supervisionId"
            errorText={errors.supervisionId?.message}
            items={supervisions}
            isRequired
          />
          <SelectInput
            label="Status Kerja"
            control={control}
            errorText={errors.workStatusId?.message}
            items={workStatuses}
            placeholder="Pilih Status Kerja"
            name="workStatusId"
            isRequired
          />
        </Row>
        {typeEmployeeWatcher?.includes("Borongan") &&
          <TextInput
            label="Upah Karyawan"
            control={control}
            placeholder="0"
            name="wages"
            isCurrency
          />
        }

        {defaultBlocks.map((v, i) => (
          <BlockView
            {...v}
            key={i}
            index={i}
            control={control}
            totalHkAmount={totalHkAmount}
            setValue={setValue}
            blockAll={blockAll}
          />
        ))}
        {blockForm.map((v, i) => (
          <BlockView
            {...v}
            key={i}
            index={i}
            blocks={blocks}
            bkmData={bkmData}
            isEdit={isEdit}
            control={control}
            totalHkAmount={totalHkAmount}
            setValue={setValue}
            blockAll={blockAll}
            onDelete={() => {
              const newBlockForm = blockForm.filter((_, idx) => idx !== i)
              setBlockForm(newBlockForm)
            }}
            setFieldBlockForm={setFieldBlockForm}
          />
        ))}

        {!isEdit && (
          <Button
            style={{ alignSelf: 'flex-start', marginBottom: 16, height: 40 }}
            onPress={() => {
              setBlockForm([
                ...blockForm,
                { blockId: '', workResultHa: '', hkAmount: '', supervisionId: '', workStatusId: '', bkmMaterials: [] },
              ])
              scrollViewRef?.current?.scrollToEnd({ animated: true })
            }}>
            <Text style={{ fontSize: 12 }} color="white">
              Tambah Blok
            </Text>
          </Button>
        )}
      </ScrollView>
      <View style={styles.wrapSubmitButton}>
        <Button
          style={{ marginBottom: 26 }}
          disabled={Boolean(formBKMTakeCareStatus?.loading)}
          onPress={handleSubmit(onSubmit)}>
          <Text color="white">{formBKMTakeCareStatus?.loading ? 'Loading...' : 'Simpan BKM'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

const BlockView = ({
  isEdit,
  blockId,
  workResultHa,
  bkmData,
  hkAmount,
  index,
  setFieldBlockForm,
  control,
  blocks,
  blockAll,
  onDelete,
  viewOnly = false,
  totalHkAmount = 0,
  bkmMaterials = [],
}: any) => {
  const rawMaterialAll = useSelector((state: RootStateType) => state.rawMaterial?.rawMaterialAll?.data || [])
  const navigation: any = useNavigation()
  const blockDetail = blockAll.find((e: any) => e.id === blockId)
  const handleAddMaterial = (material: any) =>
    navigation.navigate(Routes.BKM_TAKE_CARE_MATERIAL_FORM, {
      material,
      blockId,
      bkmData,
      bkmMaterials,
      onSubmit: (m: any) => {
        const detail = rawMaterialAll.find(e => e.id === m.materialId)
        const found = bkmMaterials.find((_: any) => _.materialId === m.materialId)
        m.uom = detail?.uom
        if (found) {
          const data = bkmMaterials.map((_: any) => (_.materialId === m.materialId ? m : _))
          setFieldBlockForm(index, 'bkmMaterials', data)
        } else {
          const data = [...bkmMaterials, m]
          setFieldBlockForm(index, 'bkmMaterials', data)
        }
      },
    })
  return (
    <View
      style={{ backgroundColor: theme.colors.light2, padding: 16, borderRadius: 10, marginBottom: 16, paddingTop: 20 }}>
      {!isEdit && !viewOnly && (
        <TouchableOpacity onPress={onDelete} style={{ position: 'absolute', right: 0, top: 0, padding: 16 }}>
          <AntDesign name={'delete'} size={18} color={theme.colors.black} />
        </TouchableOpacity>
      )}
      <SelectInput
        label="Blok"
        control={control}
        items={blocks}
        value={blockId}
        defaultValue={blockId}
        disabled={viewOnly}
        disabledText={blockDetail?.code}
        placeholder="Pilih Blok"
        name={'blockId'}
        errorText={blockId?.length === 0 ? 'Blok harus diisi' : undefined}
        onChange={(value: any) => {
          setFieldBlockForm(index, 'blockId', value)
        }}
        isRequired
      />
      <Row>
        <TextInput
          label="Tahun Tanam"
          control={control}
          placeholder="2019"
          name="plantingYear"
          disabledText={blockDetail?.plantingYear?.join(', ')}
          value={blockDetail?.plantingYear?.join(', ')}
          errorText={blockId?.length === 0 ? 'Blok harus diisi' : undefined}
          disabled
          isRequired
        />
        <TextInput
          label="Luas Blok"
          control={control}
          placeholder="3 Ha"
          name="blockArea"
          disabledText={blockDetail?.blockArea ? blockDetail?.blockArea + ' Ha' : ''}
          value={blockDetail?.blockArea}
          errorText={blockId?.length === 0 ? 'Blok harus diisi' : undefined}
          disabled
          isRequired
        />
      </Row>
      <Row>
        <TextInput
          label="Hasil Kerja (Ha)"
          control={control}
          placeholder="Contoh : 1"
          name={'workResultHa'}
          value={workResultHa}
          defaultValue={workResultHa}
          disabledText={workResultHa?.length > 0 ? workResultHa + ' Ha' : ''}
          disabled={viewOnly}
          errorText={
            workResultHa?.length === 0
              ? 'Hasil Kerja harus diisi'
              : parseFloat(workResultHa) > parseFloat(blockDetail?.blockArea)
                ? 'Hasil Kerja tidak boleh lebih besar dari Luas Blok'
                : undefined
          }
          isNumber
          isFloat
          onChangeText={(value: any) => {
            setFieldBlockForm(index, 'workResultHa', value)
          }}
          isRequired
        />
        <TextInput
          label={'Jumlah HK'}
          control={control}
          placeholder={'Contoh : 0.8'}
          name={'hkAmount'}
          value={hkAmount}
          defaultValue={hkAmount}
          disabled={viewOnly}
          disabledText={hkAmount?.length > 0 ? hkAmount : ''}
          errorText={
            !hkAmount
              ? 'Jumlah HK harus diisi'
              : undefined || parseFloat(totalHkAmount) > 1
                ? 'Jumlah Semua HK tidak boleh melebihi 1'
                : undefined
          }
          isNumber
          isFloat
          onChangeText={(value: any) => {
            setFieldBlockForm(index, 'hkAmount', value)
          }}
          isRequired
        />
      </Row>

      <Button style={{ alignSelf: 'flex-start', marginBottom: 16, height: 38 }} onPress={handleAddMaterial}>
        <Text style={{ fontSize: 12 }} color="white">
          Tambah Material
        </Text>
      </Button>
      {bkmMaterials.map((m: any) => (
        <MaterialCard
          item={m}
          onEdit={() => handleAddMaterial(m)}
          onDelete={() => {
            const data = bkmMaterials.filter((_: any) => _.materialId !== m.materialId)
            setFieldBlockForm(index, 'bkmMaterials', data)
          }}
        />
      ))}
    </View>
  )
}

const Row = ({ children }: any) => (
  <View style={{ flexDirection: 'row' }}>
    <View style={{ marginRight: 5, flex: 1 }}>{React.Children.toArray(children)[0]}</View>
    <View style={{ marginLeft: 5, flex: 1 }}>{React.Children.toArray(children)[1]}</View>
  </View>
)

export default BKMForm
