import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {Button, Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IModalInfoProps {
  onTouchOutside: () => void
  title: string
  description?: string
  isOpen: boolean
}

const ModalGeneral: React.FC<IModalInfoProps> = props => {
  return (
    <Modal animationType="fade" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity testID="onTouchOutsideButton" onPress={props.onTouchOutside} style={styles.centeredView}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text type="semibold">{props.title}</Text>
              </View>
              <TouchableOpacity onPress={props.onTouchOutside}>
                <Icon name="close" size={20} color={theme.colors.textThinBlack} />
              </TouchableOpacity>
            </View>
            {props.description && (
              <Text size={13} style={[{marginBottom: 16}]} color={theme.colors.textThinBlack}>
                {props.description}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalGeneral

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
    paddingHorizontal: 16,
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
  centerText: {},
})
