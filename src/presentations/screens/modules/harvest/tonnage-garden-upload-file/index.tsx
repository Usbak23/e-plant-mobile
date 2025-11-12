import React, {useState, useEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {theme} from '@app/presentations/utils/styles'
import {Button, Header, Text} from '@app/presentations/_shared-components'
import SelectTonnageGardenFile from './select-file-view'
import { pick, keepLocalCopy } from '@react-native-documents/picker'
import FeatherFolder from '@assets/icons/feather/feather_folder.svg'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {actions, RootStateType} from '@app/domain/states/store'
import {showErrorToast, showSuccessToast} from '@app/presentations/_shared-components/Toast'
import {IEffectPayload} from '@app/domain/states/types'

const TonnageGardenUploadFile = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const query = route?.params?.query
  const date = query?.date
  const organizationId = query?.organizationId
  const formTonnageGardenStatus: IEffectPayload = useSelector(
    (state: RootStateType) => state?.tonnageGarden?.formTonnageGardenStatus || {loading: false},
  )
  const [file, setFile] = useState()

  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
        allowMultiSelection: false,
      })
      // @ts-ignore
      setFile(res[0])
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err
      }
    }
  }

  const handleUpload = () => {
    if (!file) {
      showErrorToast('Pilih file terlebih dahulu!')
      return
    }
    dispatch(
      actions.uploadTonnageGarden.request({
        loading: true,
        data: {
          date,
          file,
          organizationId,
        },
      }),
    )
  }

  useEffect(() => {
    const error = formTonnageGardenStatus?.error
    if (error) {
      showErrorToast(error.message)
    }
  }, [formTonnageGardenStatus?.error])

  useEffect(() => {
    const data = formTonnageGardenStatus?.data?.data
    if (data?.status == 'success') {
      showSuccessToast('File berhasil diunggah')
      navigation.goBack()
    }
  }, [formTonnageGardenStatus?.data])

  const FileStatusView = () => (
    <View style={styles.fileStatusView}>
      <TouchableOpacity onPress={() => {}} style={styles.fileStatusLeft}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FeatherFolder width={36} height={36} />
          <Text
            color={theme.colors.accent}
            maxLines={2}
            style={{flexShrink: 1, marginLeft: 8}}
            type="semibold"
            size={14}>
            {
              //@ts-ignore
              file?.name || 'file_absensi'
            }
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{justifyContent: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => {
            setFile(undefined)
          }}
          style={styles.deleteFileButton}>
          <Icon name="delete" size={18} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  )
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Unggah File Tonase Kebun" />
      <ScrollView style={styles.scroll}>
        <SelectTonnageGardenFile onChooseFile={chooseFile} />
        {file && Object.keys(file).length != 0 && <FileStatusView />}
        <Button disabled={Boolean(formTonnageGardenStatus?.loading)} style={{marginTop: 28}} onPress={handleUpload}>
          <Text color="white">Unggah File Tonase Kebun</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TonnageGardenUploadFile

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.pureWhite,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  fileStatusView: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteFileButton: {
    borderRadius: 5,
    marginVertical: 16,
    backgroundColor: theme.colors.yellowSemiTransparent,
    height: 40,
    width: 40,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    alignItems: 'center',
  },
})
