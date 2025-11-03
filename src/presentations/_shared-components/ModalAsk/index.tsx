import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {Button, Text} from '..'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IModalAskProps {
  isOpen?: boolean
  onTouchOutside: () => void
  isDanger?: boolean
  title: string
  description: string
  positiveButtonText: string
  onPositiveButtonTap: () => void
}

const ModalAsk: React.FC<IModalAskProps> = props => {
  return (
    <Modal animationType="none" transparent={true} visible={Boolean(props.isOpen)}>
      <TouchableOpacity testID="modalAskOnTouchOutside" onPress={props.onTouchOutside} style={styles.centeredView}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <Icon
              name={props.isDanger ? 'warning' : 'check-circle-outline'}
              size={48}
              color={props.isDanger ? '#E95675' : '#F0B10D'}
            />

            <Text style={[styles.centerText, {marginVertical: 16}]} type="semibold">
              {props.title}
            </Text>
            <Text size={12} style={[styles.centerText, {marginBottom: 16}]} color={theme.colors.label}>
              {props.description}
            </Text>

            <View style={styles.wrapBtn}>
              <Button
                testId="modalAskPositiveButton"
                style={[styles.footerButton, {backgroundColor: props.isDanger ? '#E95675' : '#F0B10D'}]}
                onPress={() => props.onPositiveButtonTap()}>
                <Text color="white">{props.positiveButtonText}</Text>
              </Button>
              <Button style={[styles.footerButton]} onPress={() => props.onTouchOutside()}>
                <Text color="white">Cancel</Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalAsk

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
