import React from 'react'
import {View, StyleSheet, TouchableOpacity, Image, TextInput as Input, Platform} from 'react-native'
import {theme} from '@styles'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {IProps} from '@app/presentations/types'
import {Text} from '..'

export interface IPTextInput extends IProps {
  mode?: 'outlined' | 'flat'
  isRequired?: boolean
  isNumber?: boolean
  uppercase?: boolean
  errorText?: string
  label: string
  value?: string
  placeholder?: string
  autoFocus?: boolean
  onChangeText: (text: string) => void
  onPress?: () => void
  hideLabel?: boolean
  labelMaxLine?: number
}

const PureTextInput: React.FC<IPTextInput> = props => {
  const [state, setState] = React.useState({
    hide: true,
    focus: false,
    value: '',
  })

  const handleChange = async (value: string) => {
    await setState({...state, value})
    props.onChangeText(value)
  }

  const isHaveValue = Boolean(state?.value || props?.value)

  return (
    <View testID="touchabletextinput-root" style={styles.container}>
      {props.label && !props.hideLabel ? (
        <Text
          maxLines={props.labelMaxLine}
          size={12}
          type="semibold"
          testID="touchabletextinput-label"
          style={{...styles.label, color: props.errorText ? theme.colors.error : theme.colors.textThinBlack}}>
          {props.label}
          {props.isRequired && (
            <Text testID="touchabletextinput-requiredIcon" color="red" size={11}>
              *
            </Text>
          )}
        </Text>
      ) : null}
      <TouchableOpacity testID="touchabletextinput-inputContainer" onPress={props.onPress}>
        <View testID="touchabletextinput-inputWrapper" style={styles.wrapInput}>
          <View
            testID="touchabletextinput-inputWrapperForClick"
            pointerEvents={props.onPress ? 'none' : 'auto'}
            style={styles.container}>
            <Input
              testID="touchabletextinput-input"
              value={state.value || props?.value}
              placeholder={props.placeholder}
              autoFocus={props.autoFocus}
              onChangeText={handleChange}
              placeholderTextColor="#CDCDCD"
              style={[
                styles.input,
                {
                  ...(isHaveValue && styles.haveValue),
                },
                props.style,
              ]}
              selectionColor={theme.colors.grey}
              keyboardType={props.isNumber ? 'phone-pad' : 'default'}
              autoCapitalize={props.uppercase ? 'characters' : 'none'}
              onFocus={() => setState({...state, focus: true})}
              onBlur={() => setState({...state, focus: false})}
            />
          </View>
        </View>
      </TouchableOpacity>
      {props.errorText ? (
        <View testID="touchabletextinput-errorTextContainer" style={styles.rowCenter}>
          <Text size={11} testID="touchabletextinput-errorText" style={styles.error}>
            {props.errorText}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: '#fff',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
    color: theme.colors.black,
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    height: 50,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    flex: 1,
    fontWeight: '400',
  },
  error: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
    fontSize: fs(11),
  },
  haveValue: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
  label: {
    color: theme.colors.label,
    // fontSize: fs(11),
  },
  rightIcon: {
    position: 'absolute',
    elevation: 5,
    zIndex: 5,
    right: 0,
    top: 12,
  },
  errorIconImg: {
    marginTop: 4,
    marginRight: 5,
    height: 12,
    width: 12,
  },
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
})

export default PureTextInput
