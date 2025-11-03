import {theme} from '@app/presentations/utils/styles'
import {Button, Text} from '@app/presentations/_shared-components'
import React from 'react'
import {Image, StyleSheet, View} from 'react-native'

interface IKMLChooserViewProps {
  onChooseFile?: () => void
}

const KMLChooserView: React.FC<IKMLChooserViewProps> = props => {
  const FileContainerView = () => (
    <View style={styles.fileContainerView}>
      <View style={{marginTop: 10, marginBottom: 16}}>
        <Text style={styles.centerText} type="bold">
          Unggah File KML
        </Text>
      </View>

      <Image style={{width: 48, height: 48}} source={require('@assets/icons/feather/feather_folder.png')} />
      <Button
        style={styles.chooseFileButton}
        onPress={() => {
          props.onChooseFile && props.onChooseFile()
        }}>
        <Text size={11} type="semibold" color="white">
          Pilih file
        </Text>
      </Button>
    </View>
  )
  return (
    <View style={styles.rootView}>
      <Text size={12} type="semibold" color={theme.colors.textThinBlack}>
        Tambah koordinat
      </Text>
      <FileContainerView />
    </View>
  )
}

export default KMLChooserView

const styles = StyleSheet.create({
  rootView: {
    paddingBottom: 10,
    paddingVertical: 18,
    backgroundColor: 'white',
  },
  centerText: {
    alignSelf: 'center',
  },
  actionButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 4,
  },
  fileContainerView: {
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0B10D',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(240, 177, 13, 0.1)',
  },
  chooseFileButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#F0B10D',
  },
})
