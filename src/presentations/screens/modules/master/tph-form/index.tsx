import React, {useEffect, useState} from 'react'
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView} from 'react-native'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'

import useYupValidationResolver from '@app/presentations/hooks/useYupValidationResolver'
import {useNavigation, useRoute} from '@react-navigation/native'

import {showErrorToast, showSuccessToast} from '@components/Toast'
import {TextInput, Button, Text, Header, SelectInput, Loader} from '@components/index'
import {actions, RootStateType} from '@domain/states/store'

import {useDispatch, useSelector} from 'react-redux'
import {ITPHFormData} from '@models/eplant/TPH'

import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import {useOrganizationOptions} from '@app/domain/states/organization/hooks'
import {useDivisionsByOrganization} from '@app/domain/states/division/hooks'
import {useBlocksByDivisionStd} from '@app/domain/states/block/hooks'
import KMLChooserView from '@screens/modules/master/block-form/kml-chooser-view'
import DocumentPicker from 'react-native-document-picker'
import {kml} from '@tmcw/togeojson'
import RNFS from 'react-native-fs'
import {DOMParser} from 'xmldom'
import Routes from '@navigation/Routes'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {isShouldGeoJSONNull} from '@app/presentations/utils/validation/geojson-validation'

let validationSchema = yup.object().shape({
  name: yup.string().required('Nama TPH adalah bidang yang wajib diisi!'),
  blockId: yup.string().required('Blok adalah bidang yang wajib diisi!'),
})

export default function TPHForm() {
  const resolver = useYupValidationResolver(validationSchema)
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const item = route.params?.item
  const isEdit = Boolean(item?.id)
  const module = route.params?.module
  const isRelated = Boolean(module?.id)

  const {formTPHStatus, tphDetail} = useSelector((state: RootStateType) => state.tph)
  const [organization, setOrganization] = useState(item?.organization?.id || '')
  const [division, setDivision] = useState(item?.division?.id || '')
  const [kmlFile, setKmlFile] = useState<any>({
    name: isEdit && item.fileGeoJson ? item.fileGeoJson : null,
    geoJson: isEdit && item.geoJson ? isShouldGeoJSONNull(item.geoJson) : null,
  })

  const organizations = useOrganizationOptions()
  const divisions = useDivisionsByOrganization(organization)
  const blocks = useBlocksByDivisionStd(division)

  const {
    handleSubmit,
    control,
    formState: {errors, isValid, isDirty},
    setValue,
    reset,
  } = useForm({
    resolver,
    mode: 'onChange',
    defaultValues: {
      id: item?.id,
      name: item?.name,
      divisionId: item?.block?.division?.id || module?.division?.id || '',
      organizationId: item?.block?.division?.organization?.id || module?.division?.organization.id || '',
      blockId: item?.block?.id || module?.id || '',
      geoJson: item?.geoJson ? (Object.keys(item.geoJson).length != 0 ? item.geoJson : null) : null,
      fileGeoJson: item?.fileGeoJson || null,
    },
  })

  const readFile = async (path: any) => {
    try {
      const contents = await RNFS.readFile(path, 'utf8')
      return '' + contents
    } catch (e) {}
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
      setValue('fileGeoJson', res[0].name || 'Marker')
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

  const FileStatusView = () => (
    <View style={styles.fileStatusView}>
      <TouchableOpacity onPress={() => navigation.navigate(Routes.MAPS_PREVIEW, {geoJSON: kmlFile.geoJson})}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 28, height: 28, marginEnd: 16, marginVertical: 16}}
            source={require('@assets/icons/feather/feather_file.png')}
          />
          <Text color="#F0B10D" type="semibold" size={14}>
            {kmlFile.name}
          </Text>
        </View>
      </TouchableOpacity>

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
        <Icon name="delete" size={18} color="#F0B10D" />
      </TouchableOpacity>
    </View>
  )

  useEffect(() => {
    const error = formTPHStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formTPHStatus?.error])

  useEffect(() => {
    const data = formTPHStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast(`${isEdit ? data?.response?.name || item?.name + ' berhasil diperbarui' : 'Berhasil dibuat'}`)
      navigation.goBack()
    }
  }, [formTPHStatus?.data])

  useEffect(() => {
    if (isEdit && tphDetail?.data?.id === item.id) {
      reset({
        id: tphDetail?.data?.id,
        name: tphDetail?.data?.name,
        blockId: tphDetail?.data?.block?.id,
        organizationId: tphDetail?.data?.block?.division?.organization?.id,
        divisionId: tphDetail?.data?.block?.division?.id,
        geoJson: tphDetail?.data?.geoJson,
        fileGeoJson: tphDetail?.data?.fileGeoJson,
      })
      setOrganization(tphDetail?.data?.block?.division?.organization?.id)
      setDivision(tphDetail?.data?.block?.division?.id)
    }
  }, [tphDetail?.data])

  useEffect(() => {
    if (isEdit) {
      dispatch(actions.getTPHDetail.request({loading: true, data: item.id}))
    }
    dispatch(actions.getOrganizationAll.request({loading: true}))
    dispatch(actions.getAllDivision.request({loading: true}))
    dispatch(actions.getAllBlock.request({loading: true}))
  }, [])

  const onSubmit = (data: ITPHFormData) => {
    if (isEdit) {
      dispatch(actions.editTPH.request({loading: true, data}))
      return
    }
    dispatch(actions.createTPH.request({loading: true, data}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={isEdit ? 'Ubah TPH' : 'Tambah TPH'} />
      <Loader loading={Boolean(tphDetail?.loading)} />
      <View style={[styles.container, styles.contentContainer]}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SelectInput
            disabledText={
              isRelated ? module?.division?.organization?.name : isEdit ? item?.block?.division?.organization?.name : ''
            }
            disabled={isRelated ? true : Boolean(isEdit)}
            // disabledClickable={!isRelated}
            items={organizations}
            control={control}
            label="Organisasi"
            placeholder="Pilih Organisasi"
            name="organizationId"
            key="organizationId"
            errorText={errors?.organizationId?.message}
            onChange={v => {
              setValue('divisionId', '', {
                shouldValidate: true,
              })
              setOrganization(v)
            }}
            isRequired
          />
          <SelectInput
            disabledText={isRelated ? module?.division?.name : isEdit ? item?.block?.division?.name : ''}
            items={divisions}
            control={control}
            label="Kode Divisi"
            placeholder="Pilih Divisi"
            name="divisionId"
            key="divisionId"
            errorText={errors?.divisionId?.message}
            onChange={v => {
              setValue('blockId', '', {
                shouldValidate: true,
              })
              setDivision(v)
            }}
            disabled={organization.length === 0 || isRelated ? true : Boolean(isEdit)}
            // disabledClickable={!isRelated}
            isRequired
          />
          <SelectInput
            disabledText={isRelated ? module?.code : isEdit ? item?.block?.code : ''}
            items={blocks}
            control={control}
            label="Kode Blok"
            placeholder="Pilih Blok"
            name="blockId"
            key="blockId"
            errorText={errors?.blockId?.message}
            disabled={division.length === 0 || isRelated ? true : Boolean(isEdit)}
            // disabledClickable={!isRelated}
            isRequired
          />
          <TextInput
            control={control}
            label="Nama TPH"
            placeholder="Contoh : TPH 1"
            name="name"
            errorText={errors?.name?.message}
            isRequired
          />
          <KMLChooserView onChooseFile={chooseFile} />
          {kmlFile.name && kmlFile.geoJson && <FileStatusView />}
          <Button disabled={Boolean(formTPHStatus?.loading)} onPress={handleSubmit(onSubmit)}>
            <Text color="white">{formTPHStatus?.loading ? 'Loading...' : isEdit ? 'Ubah TPH' : 'Tambah TPH'}</Text>
          </Button>
        </ScrollView>
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
  fileStatusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteFileButton: {
    borderRadius: 5,
    backgroundColor: 'rgba(240, 177, 13, 0.15)',
    height: 40,
    width: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
