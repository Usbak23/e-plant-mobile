import React, {ReactNode} from 'react'
import {Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'

interface IModalFilterProps {
  isOpen?: boolean
  onTouchOutside: () => void
  children?: ReactNode
}

const ModalFilter: React.FC<IModalFilterProps> = props => {
  return (
    <Modal animationType="none" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity testID="touchOutsideButton" style={styles.centeredView} onPress={props.onTouchOutside}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>{props.children}</View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalFilter

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
    alignItems: 'center',
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
    textAlign: 'center',
  },
  deleteButton: {marginLeft: 10},
  wrapBtn: {flexDirection: 'row', marginHorizontal: -8},
})
