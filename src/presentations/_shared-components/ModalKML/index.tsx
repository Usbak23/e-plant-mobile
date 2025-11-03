import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {Image, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {Button, Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Progress from 'react-native-progress'

interface IModalKMLProps {
  isOpen?: boolean
  onTouchOutside: () => void
  onChooseFile?: () => void
  fileChoosed?: any
}

const ModalKML: React.FC<IModalKMLProps> = props => {
  const onTapFile = () => {
    props.onChooseFile && props.onChooseFile()
  }
  const CloseButton = () => (
    <TouchableOpacity testID="onTouchOutsideButton" onPress={props.onTouchOutside} style={{alignItems: 'flex-end'}}>
      <Icon name={'close'} size={22} color={theme.colors.black} />
    </TouchableOpacity>
  )

  const FileContainerView = () => (
    <View style={styles.fileContainerView}>
      <Image style={{width: 48, height: 48}} source={require('@assets/icons/feather/feather_folder.png')} />
      <Button style={styles.chooseFileButton} onPress={onTapFile}>
        <Text size={11} type="semibold" color="white">
          Pilih file
        </Text>
      </Button>
    </View>
  )

  const FileStatusView = () => (
    <View style={styles.fileStatusView}>
      <Image style={{width: 38, height: 38}} source={require('@assets/icons/feather/feather_file.png')} />
      <View style={{flex: 1}}>
        <Text type="semibold" size={14}>
          {props.fileChoosed && props.fileChoosed.name}
        </Text>
        <Progress.Bar width={null} color="#F0B10D" borderWidth={1} progress={0.6} />
        <View />
      </View>
    </View>
  )

  return (
    <Modal animationType="none" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity onPress={props.onTouchOutside} style={styles.centeredView}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <CloseButton />
            <Text style={styles.centerText} type="bold">
              Unggah File KML
            </Text>
            <Text size={12} style={styles.centerText} color={theme.colors.label}>
              Ukuran file tidak boleh lebih dari 5MB
            </Text>
            <FileContainerView />
            {props.fileChoosed && <FileStatusView />}

            <View style={styles.wrapBtn}>
              <Button
                disabled={!props.fileChoosed}
                style={[styles.footerButton]}
                onPress={() => props.onTouchOutside()}>
                <Text color="white">Simpan</Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalKML

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  modalView: {
    marginHorizontal: 18,
    paddingHorizontal: 18,
    paddingBottom: 10,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginVertical: 16,
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
  fileStatusView: {
    flexDirection: 'row',
  },
  deleteButton: {marginLeft: 10},
  wrapBtn: {flexDirection: 'row', marginHorizontal: -8, marginTop: 8},
})
