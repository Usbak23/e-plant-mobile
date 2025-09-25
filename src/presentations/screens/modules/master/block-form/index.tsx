import { theme } from '@app/presentations/utils/styles'
import { Button, DisabledInput, Header, SelectInput, Text, TextInput, TextInputChip } from '@app/presentations/_shared-components'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { useFieldArray, useForm } from 'react-hook-form'
import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import { kml } from '@tmcw/togeojson'
import { DOMParser } from 'xmldom'
import { useNavigation } from '@react-navigation/core'
import Routes from '@app/presentations/navigation/Routes'
import KMLChooserView from './kml-chooser-view'
import { useOrganizationOptions } from '@app/domain/states/organization/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useDivisionsByOrganization, useDivisionsByOrganizationFull } from '@app/domain/states/division/hooks'
import { useUsersByOrganizationAndRole } from '@app/domain/states/user/hooks'
import { IBlockFormData } from '@app/models/eplant/Block'
import { actions, RootStateType } from '@domain/states/store'
import { showErrorToast, showSuccessToast } from '@app/presentations/_shared-components/Toast'
import { useRoute } from '@react-navigation/native'
import * as schema from '@utils/validation/block-validation'
import { styles } from './style'
import { GeoJSON } from 'geojson'
import { isShouldGeoJSONNull } from '@app/presentations/utils/validation/geojson-validation'
import { useRangeYear } from '@app/domain/states/master/hooks'
import { CHAPELS } from '@app/models/eplant/Chapel'
import Feather from 'react-native-vector-icons/Feather'
import { useWatch } from 'react-hook-form'

const BlockForm = () => {
  const route: any = useRoute()
  const item = route.params?.item
  const withDivision = route.params?.withDivision
  const isEdit = Boolean(item?.id)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(schema.blockValidationSchema)
  const { formCreateBlockStatus } = useSelector((state: RootStateType) => state.block)

  const [varieties, setVarieties] = useState<string>('')
  const [varietyError, setVarietyError] = useState<string>('')
  const [kmlFile, setKmlFile] = useState<{ name: string | null | undefined; geoJson: GeoJSON | null | undefined }>({
    name: !isEdit ? null : item.fileGeoJson == '' ? null : item?.fileGeoJson,
    geoJson: isEdit ? isShouldGeoJSONNull(item.geoJson) : null,
  })

  const constructPlantingYearHistory = () => {
    const arr: { plantingYear: string, totalTreeEachYear: string, blockAreaEachYear: string }[] = []
    item?.plantingYear && item?.plantingYear?.forEach((element: string, index: number) => {
      arr.push({
        plantingYear: element,
        totalTreeEachYear: item?.totalTreeEachYear && item?.totalTreeEachYear[index] != undefined ? item?.totalTreeEachYear[index] : '',
        blockAreaEachYear: item?.blockAreaEachYear && item?.blockAreaEachYear[index] != undefined ? item?.blockAreaEachYear[index] : ''
      })
    })

    return arr
  }

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors, isValid, isDirty },
    getValues,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      id: item?.id || undefined,
      organization: withDivision ? withDivision.organization?.id : item?.division?.organization?.id || '',
      divisionId: withDivision ? withDivision.id : item?.division?.id || '',
      code: item?.code || '',
      blockArea: item?.blockArea != undefined ? item.blockArea.toString() : '',
      totalTree: item?.totalTree != undefined ? item.totalTree.toString() : '',
      numberOfLine: item?.numberOfLine != undefined ? item.numberOfLine.toString() : '',
      harvestChapel: item?.harvestChapel != undefined ? item.harvestChapel.toString() : '',
      varieties:
        item?.varieties && Array.isArray(item?.varieties) && item?.varieties?.length != 0
          ? item.varieties.map((v: string, i: number) => {
            return { id: i.toString(), variety: v }
          })
          : [],
      careForeman: item?.careForeman?.id || null,
      harvestForeman: item?.harvestForeman?.id || null,
      harvestClerk: item?.harvestClerk?.id || null,
      geoJson: item?.geoJson ? (Object.keys(item.geoJson).length != 0 ? item.geoJson : null) : null,
      fileGeoJson: item?.fileGeoJson || null,
      //phase-3
      usedArea: item?.usedArea ? item?.usedArea?.toString() : '',
      unusedArea: item?.unusedArea ? item?.unusedArea?.toString() : '',
      bjr: item?.bjr ? item?.bjr?.toString() : '',
      plantingYearHistory: !isEdit ? [] : constructPlantingYearHistory()
    },
  })

  const [selectedOrganization, setSelectedOrganization] = useState(
    item?.division?.organization?.id || withDivision?.organization?.id || '',
  )
  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(selectedOrganization || '')
  const divs = useDivisionsByOrganizationFull(selectedOrganization)

  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore
    name: 'plantingYear',
  })

  const { fields: fieldsPlantingYearHistory, append: appendPlantingYear, remove: removePlantingYear } = useFieldArray({
    control,
    name: 'plantingYearHistory'
  })

  const {
    fields: varietyFields,
    append: varietyAppends,
    remove: varietyRemove,
  } = useFieldArray({
    control,
    //@ts-ignore
    name: 'varieties',
  })

  const plantingYearHistoryWatcher = useWatch({
    control: control,
    name: 'plantingYearHistory',
    defaultValue: control._defaultValues?.plantingYearHistory || [],
  })



  const handleVarietyAppend = (value: string) => {
    setVarietyError('')
    if (value.trim() != '') {
      const isExists = varietyFields.find((variant: any) => variant.variety.toLowerCase() == value.toLowerCase().trim())
      if (!isExists) {
        varietyAppends({ variety: value.trim() })
        clearErrors('varieties')
      }
    } else {
      setVarietyError('Masukkan varietas dengan benar')
    }
  }

  const readFile = async (path: any) => {
    try {
      const contents = await RNFS.readFile(path, 'utf8')
      return '' + contents
    } catch (e) {
      console.log('Read file error: ' + e)
    }
  }

  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: ['application/vnd.google-earth.kml+xml'],
        allowMultiSelection: false,
      })

      const read = await readFile(res[0].uri)
      const theKml = new DOMParser().parseFromString(read)
      const converted = kml(theKml)
      setValue('geoJson', converted)
      setValue('fileGeoJson', res[0].name)
      setKmlFile({
        ...kmlFile,
        name: res[0].name,
        geoJson: converted,
      })
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err
      }
    }
  }

  const constructToFormData = (value: any) => {
    const form: IBlockFormData = {
      id: isEdit ? item.id : undefined,
      divisionId: value.divisionId,
      code: value.code,
      blockArea: value.blockArea,
      //disabled on phase 3
      // totalTree: value.totalTree,
      // plantingYear: value.plantingYear.map((y: any) => y.year.toString()),
      harvestChapel: value.harvestChapel,
      numberOfLine: value.numberOfLine,
      varieties: value.varieties.map((v: any) => v.variety.toString()),
      harvestForeman: null,
      careForeman: null,
      harvestClerk: null,
      fileGeoJson: value.fileGeoJson,
      geoJson: value.geoJson,
      //phase 3
      plantingYear: value.plantingYearHistory.map((y: any) => y.plantingYear.toString()),
      totalTreeEachYear: value.plantingYearHistory.map((y: any) => y.totalTreeEachYear.toString()),
      blockAreaEachYear: value.plantingYearHistory.map((y: any) => y.blockAreaEachYear.toString()),
      usedArea: parseFloat(value.usedArea),
      unusedArea: parseFloat(value.unusedArea),
      bjr: value?.bjr
    }
    return form
  }

  const calculateSPHToView = (): string => {
    //Akumulasi jumlah pokok. (Pokok == Pohon)
    let accumulatedTotalTree = 0
    //Akumulasi luas ha
    let accumulatedAreaInHa = 0
    plantingYearHistoryWatcher && plantingYearHistoryWatcher?.forEach((element: any) => {
      accumulatedTotalTree += parseInt(element.totalTreeEachYear) || 0
      accumulatedAreaInHa += parseFloat(element.blockAreaEachYear) || 0
    });

    const result = accumulatedTotalTree / accumulatedAreaInHa
    return !result || isNaN(result) || !isFinite(result) ? '-' : result.toFixed(2).toString()
  }

  const checkAreaIsValid = () => {
    if (withDivision) {
      const isValid = withDivision.area >= parseFloat(getValues('blockArea'))
      if (!isValid) {
        showErrorToast(`Luas area tidak boleh melebihi luas divisi (${withDivision.area})`)
      }
      return Boolean(isValid)
    }

    const singleDiv = divs.find(d => d.id == getValues('divisionId'))
    if (singleDiv) {
      const isValid = Boolean(singleDiv.area >= getValues('blockArea'))
      if (!isValid) {
        showErrorToast(`Luas area tidak boleh melebihi luas divisi (${singleDiv.area})`)
      }
      return isValid
    }
    showErrorToast('Luas area tidak boleh melebihi luas divisi')
    return false
  }

  const onSubmit = (value: any) => {
    if (checkAreaIsValid()) {
      const requestBody: IBlockFormData = constructToFormData(value)
      if (isEdit) {
        dispatch(actions.editBlock.request({ loading: true, data: requestBody }))
        return
      }
      dispatch(actions.createBlock.request({ loading: true, data: requestBody }))
      return
    }
  }

  const setOrganizationManually = () =>
    setValue('organization', withDivision.organization?.id, {
      shouldValidate: true,
    })

  const setDivisionManually = () =>
    setValue('divisionId', withDivision.id, {
      shouldValidate: true,
    })

  useEffect(() => {
    dispatch(actions.getRangeYear.request({ loading: true }))
    if (withDivision) {
      setOrganizationManually()
      setDivisionManually()
    } else {
      dispatch(actions.getOrganizationAll.request({ loading: true }))
      dispatch(actions.getAllDivision.request({ loading: true }))
      dispatch(actions.getAllUser.request({ loading: true }))
    }
  }, [])

  useEffect(() => {
    const error = formCreateBlockStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formCreateBlockStatus?.error])

  useEffect(() => {
    const data = formCreateBlockStatus?.data?.data
    if (data?.code == '200') {
      showSuccessToast(`${isEdit ? 'Perubahan disimpan' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formCreateBlockStatus?.data])

  const goToMapsPreview = () => {
    //@ts-ignore
    navigation.navigate(Routes.MAPS_PREVIEW, {
      geoJSON: kmlFile.geoJson,
    })
  }

  const HeaderView = () => <Header title={isEdit ? 'Ubah Blok' : 'Tambah Blok'} />

  const FileStatusView = () => (
    <View style={styles.fileStatusView}>
      <TouchableOpacity onPress={() => goToMapsPreview()} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 28, height: 28, marginEnd: 16, marginVertical: 16 }}
            source={require('@assets/icons/feather/feather_file.png')}
          />
          <Text color={theme.colors.accent} maxLines={2} style={{ flexShrink: 1 }} type="semibold" size={14}>
            {kmlFile?.name}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => {
            setKmlFile({
              ...kmlFile,
              name: null,
              geoJson: null,
            })
            setValue('geoJson', null)
            setValue('fileGeoJson', null)
          }}
          style={styles.deleteFileButton}>
          <Icon name="delete" size={18} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <HeaderView />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <SelectInput
          disabledText={
            withDivision ? withDivision?.organization?.name : isEdit ? item?.division?.organization?.name : ''
          }
          // disabledText={withDivision?.organization?.name}
          disabled={withDivision ? true : Boolean(isEdit)}
          defaultValue={control._defaultValues.organization}
          onChange={value => {
            setSelectedOrganization(value)
            setValue('divisionId', '', {
              shouldValidate: true,
            })
            setValue('careForeman', null, {
              shouldValidate: true,
            })
            setValue('harvestClerk', null, {
              shouldValidate: true,
            })
            setValue('harvestForeman', null, {
              shouldValidate: true,
            })
          }}
          isRequired
          items={organizations}
          control={control}
          label="Organisasi"
          placeholder="Pilih Organisasi"
          name="organization"
          errorText={errors?.organization?.message}
        />

        <SelectInput
          disabledText={withDivision ? withDivision?.name : isEdit ? item?.division?.name : ''}
          // disabledText={withDivision?.name}
          disabled={withDivision ? true : Boolean(isEdit)}
          defaultValue={control._defaultValues.divisionId}
          isRequired
          items={divisions}
          control={control}
          label="Nama Divisi"
          placeholder="Pilih divisi"
          name="divisionId"
          key="divisionId"
          errorText={errors?.divisionId?.message}
        />

        <TextInput
          control={control}
          label="Nama Blok"
          placeholder="Contoh: Blok A01"
          name="code"
          errorText={errors?.code?.message}
          isRequired
        />
        <TextInput
          isFloat={true}
          isNumber
          control={control}
          label="Luas Blok (Ha)"
          placeholder="Contoh: 30 Ha"
          name="blockArea"
          errorText={errors?.blockArea?.message}
          isRequired
        />

        <TextInput
          control={control}
          label="Luas Terpakai"
          placeholder="Contoh : 20 Ha"
          name="usedArea"
          errorText={errors?.usedArea?.message}
          isNumber
          isFloat
        />
        <TextInput
          control={control}
          label="Luas Tidak Terpakai"
          placeholder="Contoh : 10 Ha"
          name="unusedArea"
          errorText={errors?.unusedArea?.message}
          isNumber
          isFloat
        />
        <Text
          style={{
            color: theme.colors.textThinBlack
          }}
          size={12}
          type="semibold">
          Tahun Tanam<Text color="red" size={11}>*</Text>
        </Text>

        {
          errors?.plantingYearHistory?.message && <Text color="red" size={11}>{errors?.plantingYearHistory?.message}</Text>
        }


        {
          fieldsPlantingYearHistory.map((f: any, idx: number) => (
            <View
              key={f.id}
              style={{
                marginVertical: 8,
                flex: 1,
                padding: 8,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: theme.colors.separator
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.lightGrey,
                  height: 32,
                  width: 32,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end'
                }} onPress={() => { removePlantingYear(idx) }}>
                <Feather name="trash" size={18} />
              </TouchableOpacity>

              <TextInput
                isNumber
                control={control}
                label="Tahun Tanam"
                placeholder="Contoh: 100"
                name={`plantingYearHistory.[${idx}].plantingYear`}
                errorText={errors?.[`plantingYearHistory[${idx}].plantingYear`]?.message}
                isRequired
              />
              <TextInput
                isNumber
                control={control}
                label="Jumlah Pokok"
                placeholder="Contoh: 100"
                name={`plantingYearHistory.[${idx}].totalTreeEachYear`}
                errorText={errors?.[`plantingYearHistory[${idx}].totalTreeEachYear`]?.message}
                isRequired
              />
              <TextInput
                isNumber
                isFloat
                control={control}
                label="Luas"
                placeholder="Contoh: 100"
                name={`plantingYearHistory.[${idx}].blockAreaEachYear`}
                errorText={errors?.[`plantingYearHistory[${idx}].blockAreaEachYear`]?.message}
                isRequired
              />
            </View>
          ))
        }


        <TouchableOpacity
          onPress={() => {
            appendPlantingYear({
              plantingYear: '',
              totalTreeEachYear: '',
              blockAreaEachYear: ''
            })
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 24,
            borderWidth: 1,
            marginTop: 8,
            marginBottom: 16,
            borderStyle: 'dashed',
            alignItems: 'center',
            borderColor: theme.colors.grey,
            borderRadius: 8
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather style={{ marginEnd: 8 }} color={theme.colors.grey} name="plus" size={20} />
            <Text style={{ color: theme.colors.textThinBlack }}>Tambah Tahun Tanam</Text>
          </View>

        </TouchableOpacity>

        <DisabledInput
          labelMaxLine={1}
          label={'SPH'}
          isRequired
          hideIcon
          value={calculateSPHToView()}
        />

        <TextInput
          isNumber
          isFloat
          control={control}
          label="BJR"
          placeholder="Contoh: 50.5 Kg"
          name="bjr"
          errorText={errors?.bjr?.message}
          isRequired
        />


        <SelectInput
          isRequired={true}
          items={CHAPELS}
          control={control}
          label="Kapel Panen"
          placeholder="Pilih Kapel Panen"
          name="harvestChapel"
          errorText={errors?.harvestChapel?.message}
          onChange={v => {
            setValue('harvestChapel', v, {
              shouldValidate: true,
            })
          }}
        />

        <TextInput
          isNumber
          control={control}
          label="Jumlah Baris"
          placeholder="Contoh: 10"
          name="numberOfLine"
          errorText={errors?.numberOfLine?.message}
          isRequired
        />

        <TextInputChip
          chipItemKey="variety"
          onChipRemove={(chipValue: any, index: number) => varietyRemove(index)}
          onSubmit={currentValue => {
            handleVarietyAppend(varieties)
            setVarieties('')
          }}
          value={varieties}
          onChangeText={text => setVarieties(text)}
          isRequired
          chipItems={varietyFields}
          //@ts-ignore
          errorText={errors?.varieties?.message}
          errorChip={varietyError}
          label="Varietas"
          placeholder="Contoh: Topaz AA"
        />



        <KMLChooserView onChooseFile={chooseFile} />

        {kmlFile?.name && kmlFile?.geoJson && <FileStatusView />}

        <Button style={{ marginBottom: 26 }} onPress={handleSubmit(onSubmit)}>
          <Text color="white">{isEdit ? 'Ubah blok' : 'Tambah blok'}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BlockForm
