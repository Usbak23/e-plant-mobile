import { theme } from '@app/presentations/utils/styles'
import { Button, Header, SelectInput, Text, TextInput, ModalInfo } from '@app/presentations/_shared-components'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import { useNavigation } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTypeEmployeeOptionsBoronganHarian, useUsersByDivision, useWorkDay } from '@app/domain/states/user/hooks'
import { actions, RootStateType } from '@domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useRoute } from '@react-navigation/native'
import * as schema from '@utils/validation/bkm-form-validation'
import { styles } from './style'
import { IBKMFormDataCreate, IBKMFormDataUpdate } from '@app/models/eplant/BKM'
import { useBlockOptions } from '@app/domain/states/block/hooks'
import moment from 'moment'
import { useSupervisionOptions, useWorkStatusOptions } from '@app/domain/states/master/hooks'
import { checkIfDuplicateExists } from '@app/presentations/utils/check'
import { useSubActivityOptions } from '@app/domain/states/subactivity/hooks'

const BKMForm = () => {
  const route: any = useRoute()
  const scrollViewRef: any = useRef()


  const typeEmployeeOptions = useTypeEmployeeOptionsBoronganHarian()
  const subActivitasPanenOptions = useSubActivityOptions('Panen')
  const workDayOptions = useWorkDay()
  const item = route.params?.item
  let bkmData = route.params?.bkmData
  const bkmEmployees = route.params?.bkmEmployees
  const isEdit = Boolean(item?.id || item?.tempId)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.bkmHarvestValidationSchema)

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      ...item,
      id: item?.id,
      date: bkmData?.date,
      typeEmployee: item?.typeEmployee || '',
      workday: item?.workday || item?.workDay || '',
      supervisionId: item?.supervision?.id || item?.supervisionId,
      subActivityId: bkmData?.subActivity?.value,
      workStatusId: item?.workStatus?.id || item?.workStatusId,
      userId: item?.user?.id || item?.userId,
      organizationId: bkmData?.organization?.value,
      divisionId: bkmData?.division?.id,
      foremanId: bkmData?.foreman?.id,
      workResultHa: item?.bkmEmployees?.length && item?.bkmEmployees[0].workResultHa,
      workResultKg: item?.bkmEmployees?.length && item?.bkmEmployees[0].workResultKg,
      hkAmount: item?.bkmEmployees?.length && item?.bkmEmployees[0].hkAmount,
      plantingYear: item?.bkmEmployees?.length && item?.bkmEmployees[0].plantingYear && item?.bkmEmployees[0].plantingYear.toString(),
    },
  })

  const [selectedUser, setSelectedUser] = useState(item?.user?.id || '')
  const [defaultBlocks, setDefaultBlock] = useState([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [blockForm, setBlockForm] = useState([
    {
      blockId: item?.block?.id || item?.blockId,
      plantingYear: item?.plantingYear != undefined ? item.plantingYear.toString() : '',
      workResultKg: item?.workResultKg != undefined ? item?.workResultKg.toString() : '',
      workResultHa: item?.workResultHa?.toString(),
      hkAmount: item?.hkAmount?.toString(),
      workStatusId: item?.workStatusId,
      supervisionId: item?.supervisionId,
      categoryChapel: item?.categoryChapel || '',
    },
  ])

  const totalHkAmount = [...blockForm, ...defaultBlocks].reduce((acc, curr) => (acc += parseFloat(curr.hkAmount)), 0)

  const formBKMStatus = useSelector((state: RootStateType) => state.bkm.formBKMStatus)
  const userAll = useSelector((state: RootStateType) => state.user?.userAll?.data || [])
  const user = userAll.find(e => e.id === selectedUser)
  const blockAll = useSelector((state: RootStateType) => state.block?.blockAll?.data || [])
  // const users = useUsersByOrganization(bkmData?.organization?.id)

  const users = useUsersByDivision(bkmData?.division?.id)
  const workStatuses = useWorkStatusOptions()
  const supervisions = useSupervisionOptions()

  const blocks = useBlockOptions(bkmData?.division?.id)

  useEffect(() => {
    if (!isEdit && selectedUser) {
      const data = bkmEmployees
        ?.filter((e: any) => e.userId === selectedUser || e?.user?.id === selectedUser)
        .map((e: any) => {
          return {
            blockId: e?.blockId || e?.block?.id,
            workResultHa: e?.workResultHa?.toString(),
            workResultKg: e?.workResultKg?.toString(),
            hkAmount: e?.hkAmount?.toString(),
            workStatusId: e?.workStatus?.id || e?.workStatusId,
            supervisionId: e?.supervision || e?.supervisionId,
            plantingYear: e?.plantingYear != undefined ? e.plantingYear.toString() : '',
            categoryChapel: e?.categoryChapel,
            viewOnly: true,
          }
        })
      setDefaultBlock(data)
    }
  }, [selectedUser])

  const checkIsBlockAndPlantingYearIsSame = (arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      const isFound = arr.find((a, j) => {
        return a.blockId == arr[i].blockId && a?.plantingYear == arr[i]?.plantingYear && j != i
      })
      if (isFound) {
        return true
      }
    }
    return false
  }

  const validateBlock = () => {
    if (blockForm?.length === 0) {
      showErrorToast('Harap tambah block terlebih dahulu!')
      return false
    }
    const field = ['blockId', 'workResultHa', 'hkAmount', 'plantingYear']
    if (blockForm.some((e: any) => !field.every((f: string) => e[f]))) {
      showErrorToast('Harap lengkapi semua data blok!')
      return false
    }
    const allBlocks = [...blockForm, ...defaultBlocks]
    // if (checkIfDuplicateExists(allBlocks)) {
    if (checkIsBlockAndPlantingYearIsSame(allBlocks)) {
      showErrorToast('Blok dan Tahun Tanam tidak boleh ada yang sama!')
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
    const data: IBKMFormDataCreate = {
      ...value,
      foremanId: value.foremanId,
      subActivity: subActivitasPanenOptions?.find(e => e.value == value.subActivityId),
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
          subActivityId: value.subActivityId,
          supervisionId: value.supervisionId,
          workStatusId: value.workStatusId,
          typeEmployee: value?.typeEmployee,
          workday: value?.workday,
          workResultHa: parseFloat(e.workResultHa),
          workResultKg: parseFloat(e.workResultKg || 0),
          hkAmount: parseFloat(e.hkAmount),
          categoryChapel: e?.categoryChapel,
        }
      }),
    }
    return data
  }

  //TODO: add categoryChapel
  const constructToFormDataUpdate = (value: any) => {
    const b = blockAll.find(b => b.id === blockForm[0]?.blockId)
    const data: IBKMFormDataUpdate = {
      ...value,
      foremanId: value.foremanId,
      userId: selectedUser,
      user: user,
      blockId: blockForm[0].blockId,
      workResultHa: parseFloat(blockForm[0].workResultHa),
      workResultKg: parseFloat(blockForm[0].workResultKg),
      hkAmount: parseFloat(blockForm[0].hkAmount),
      categoryChapel: blockForm[0]?.categoryChapel,
      plantingYear: blockForm[0]?.plantingYear,
      block: b,
    }
    return data
  }

  const onSubmit = (value: any) => {
    if (!validateBlock()) {
      return
    }


    if (isEdit) {
      const requestBody = constructToFormDataUpdate(value)
      dispatch(actions.editBKM.request({ loading: true, data: requestBody }))
      return
    }
    const requestBodyCreate = constructToFormDataCreate(value)
    // console.log('FInal payload:', JSON.stringify(requestBodyCreate))
    dispatch(actions.createBKM.request({ loading: true, data: requestBodyCreate }))
    return
  }

  const setFieldBlockForm = (index: number, field: any, value: any) => {
    const newBlockForm = blockForm.map((e, i) => {
      if (i === index) {
        const newObj = { ...e, [field]: value }
        if (field === 'blockId') {
          newObj['plantingYear'] = ''
        }
        return newObj
      } else {
        return e
      }
    })
    setBlockForm(newBlockForm)
  }

  useEffect(() => {
    dispatch(actions.clearFormBKMStatus())
    dispatch(actions.getOrganizationAll.request({ loading: true }))
    dispatch(actions.getAllDivision.request({ loading: true }))
    dispatch(actions.getAllUser.request({ loading: true }))
    dispatch(actions.getSupervisions.request({ loading: true }))
    dispatch(actions.getWorkStatus.request({ loading: true }))
  }, [])

  useEffect(() => {
    const error = formBKMStatus?.error
    if (error) {
      showErrorToast(error.message || 'Terjadi kesalahan')
    }
  }, [formBKMStatus?.error])

  useEffect(() => {
    const data = formBKMStatus?.data?.data
    if (data?.status == 'success') {
      setShowSuccessModal(true)
    }
  }, [formBKMStatus?.data?.data])

  const HeaderView = () => <Header title={isEdit ? 'Ubah BKM' : 'Tambah BKM'} />

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
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
            maxLines={1}
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
            label="Mandor"
            control={control}
            name="foremanId"
            disabledText={bkmData?.foreman?.name}
            value={bkmData?.foreman?.id}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <SelectInput
            disabled={true}
            disabledText={bkmData?.subActivity?.label || '-'}
            isRequired
            control={control}
            name='subActivityId'
            label='Sub Aktivitas'
            placeholder='Pilih Sub-Aktivitas'
            items={subActivitasPanenOptions}
          />
        </Row>
        <Row>
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
          <TextInput
            label="Peran"
            control={control}
            placeholder="Karyawan Panen"
            name="role"
            disabledText={user?.role?.name}
            value={user?.role?.name}
            disabled
            isRequired
          />
        </Row>
        <Row>
          <SelectInput
            items={typeEmployeeOptions}
            label="Jenis Karyawan"
            control={control}
            name="typeEmployee"
            errorText={errors.typeEmployee?.message}
            isRequired
          />
          <SelectInput
            label="Supervisi"
            control={control}
            placeholder="Pilih Supervisi"
            name="supervisionId"
            errorText={errors.supervisionId?.message}
            items={supervisions}
            isRequired
          />
        </Row>
        <Row>
          <SelectInput
            label="Status Kerja"
            control={control}
            errorText={errors.workStatusId?.message}
            items={workStatuses}
            placeholder="Pilih Status Kerja"
            name="workStatusId"
            isRequired
          />
          <SelectInput
            label="Hari Kerja"
            control={control}
            errorText={errors.workday?.message}
            items={workDayOptions}
            placeholder="Pilih Hari Kerja"
            name="workday"
            isRequired
          />
        </Row>


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
            plantingYear={v.plantingYear}
            index={i}
            blocks={blocks}
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
            categoryChapel={v?.categoryChapel}
          />
        ))}
        {!isEdit && (
          <Button
            style={{ alignSelf: 'flex-start', marginBottom: 16, height: 40 }}
            onPress={() => {
              setBlockForm([
                ...blockForm,
                {
                  blockId: '',
                  plantingYear: '',
                  workResultHa: '',
                  hkAmount: '',
                  supervisionId: '',
                  workStatusId: '',
                  categoryChapel: '',
                  workResultKg: ''
                },
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
          disabled={Boolean(formBKMStatus?.loading || !isValid)}
          onPress={handleSubmit(onSubmit)}>
          <Text color="white">{formBKMStatus?.loading ? 'Loading...' : 'Simpan BKM'}</Text>
        </Button>
      </View>

      <ModalInfo
        isOpen={showSuccessModal}
        title={isEdit ? 'Perubahan Berhasil Disimpan' : 'BKM Berhasil Disimpan'}
        description={`Data BKM telah ${isEdit ? 'diperbarui' : 'ditambahkan'} ke sistem`}
        positiveButtonText="Oke"
        onTouchOutside={() => {
          setShowSuccessModal(false)
          navigation.goBack()
        }}
        onPositiveButtonTap={() => {
          setShowSuccessModal(false)
          navigation.goBack()
        }}
      />
    </SafeAreaView>
  )
}

const BlockView = ({
  isEdit,
  blockId,
  workResultHa,
  workResultKg,
  plantingYear,
  hkAmount,
  categoryChapel,
  index,
  setFieldBlockForm,
  control,
  blocks,
  blockAll,
  onDelete,
  viewOnly = false,
  totalHkAmount = 0,
}: any) => {
  const blockDetail = blockAll.find((e: any) => e.id === blockId)

  return (
    <View
      style={{ backgroundColor: theme.colors.light2, padding: 16, borderRadius: 10, marginBottom: 16, paddingTop: 20 }}>
      {!isEdit && !viewOnly && (
        <TouchableOpacity onPress={onDelete} style={{ position: 'absolute', right: 0, top: 0, padding: 16 }}>
          <AntDesign name={'delete'} size={18} color={theme.colors.black} />
        </TouchableOpacity>
      )}

      <Row>
        <SelectInput
          label="Blok"
          control={control}
          items={blocks}
          value={blockId}
          defaultValue={blockId}
          disabled={viewOnly}
          disabledText={blockDetail?.code}
          placeholder="Pilih Blok"
          name={`[${index}]blockId`}
          errorText={blockId?.length === 0 ? 'Blok harus diisi' : undefined}
          onChange={(value: any) => {
            setFieldBlockForm(index, 'blockId', value)
          }}
          isRequired
        />
        <SelectInput
          value={plantingYear}
          defaultValue={plantingYear}
          label="Tahun Tanam"
          // control={control}
          placeholder="Pilih Tahun Tanam"
          items={blockDetail?.plantingYear?.map((e: string) => ({ label: e, value: e })) || []}
          errorText={blockId?.length === 0 ? 'Tahun Tanam harus diisi' : undefined}
          disabled={viewOnly}
          disabledText={plantingYear}
          name={`[${index}]plantingYear`}
          isRequired
          onChange={v => {
            setFieldBlockForm(index, 'plantingYear', v)
          }}
        />
      </Row>

      <Row>
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
      </Row>
      <Row>
        <TextInput
          label={'Janjang (Kg)'}
          control={control}
          placeholder={'Contoh : 1.8'}
          name={'workResultKg'}
          value={workResultKg}
          defaultValue={workResultKg}
          disabled={viewOnly}
          disabledText={workResultKg?.length > 0 ? workResultKg : ''}
          errorText={workResultKg?.length === 0 ? 'Janjang Kg harus diisi' : undefined}
          isNumber
          isFloat
          onChangeText={(value: any) => {
            setFieldBlockForm(index, 'workResultKg', value)
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
      <Row>
        <SelectInput
          label={'Periode Panen'}
          control={control}
          items={[
            { label: 'Mulai', value: 'Mulai' },
            { label: 'Melanjutkan', value: 'Melanjutkan' },
          ]}
          value={categoryChapel}
          defaultValue={categoryChapel}
          disabled={viewOnly || isEdit}
          disabledText={categoryChapel}
          placeholder="Pilih Periode Panen"
          name={`[${index}]categoryChapel`}
          errorText={!categoryChapel ? 'Periode Panen harus diisi' : undefined}
          onChange={(value: any) => {
            setFieldBlockForm(index, 'categoryChapel', value)
          }}
          isRequired
        />
      </Row>
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
