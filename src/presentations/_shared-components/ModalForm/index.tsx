import React, {ReactNode} from 'react'
import {Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {Text} from '..'
import Feather from 'react-native-vector-icons/Feather'

interface IModalFormProps {
  isOpen?: boolean
  onTouchOutside: () => void
  onClose?: () => void
  children?: ReactNode
  title: string
}

const ModalForm: React.FC<IModalFormProps> = props => {
  return (
    <Modal animationType="none" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity style={styles.centeredView} onPress={props.onTouchOutside}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: '#C4C4C4',
                borderBottomWidth: 1,
                paddingBottom: 12,
                paddingHorizontal: 18,
              }}>
              <Text type="semibold">{props.title}</Text>
              <TouchableOpacity onPress={props.onClose}>
                <Feather name="x" size={18} />
              </TouchableOpacity>
            </View>
            <View style={{padding: 16}}>{props.children}</View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalForm

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  footerButton: {
    marginHorizontal: 8,
  },
  modalView: {
    marginHorizontal: 18,
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
    textAlign: 'center',
  },
  deleteButton: {marginLeft: 10},
  wrapBtn: {flexDirection: 'row', marginHorizontal: -8},
})
