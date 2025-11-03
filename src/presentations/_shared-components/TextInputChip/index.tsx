import {theme} from '@app/presentations/utils/styles'
import React, {memo} from 'react'
import {
  ImageStyle,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import {RemovableChip, Text} from '..'
import Feather from 'react-native-vector-icons/Feather'
import numberOnly from '@app/presentations/utils/numberOnly'

// this is not used in react hook form.
// the react hook form will validate the generated item from this

interface ITextInputChipProps {
  type?: 'round' | 'default'
  isPassword?: boolean
  isNumber?: boolean
  uppercase?: boolean
  isRequired?: boolean
  errorText?: string
  errorChip?: string
  label?: string
  icon?: any
  disabled?: boolean
  multiline?: boolean
  textAlignVertical?: 'auto' | 'bottom' | 'center' | 'top'
  numberOfLines?: number
  iconStyle?: StyleProp<ImageStyle>
  style?: StyleProp<TextStyle>
  value?: string
  defaultValue?: string
  placeholder?: string
  autoFocus?: boolean
  onChangeText?: (text: string) => void
  useDarkTheme?: boolean
  onKeyPress?: (event: any) => void
  onSubmit?: (currentValue: string | undefined) => void
  chipItems: any
  onChipRemove: (chipValue: any, index: number) => void
  chipItemKey: string
}
const TextInputChip = React.forwardRef<TextInput, ITextInputChipProps>((props, ref) => {
  const [state, setState] = React.useState({
    hide: true,
    focus: false,
  })

  const dynamicStyle = {
    borderColor: props.errorText ? theme.colors.error : theme.colors.defaultBorderColor,
  }

  const borderColor = state.focus && !props.errorText ? {borderColor: theme.colors.accent} : {}

  const constructErrorMessage = () => {
    const inputError = props.errorText ? props.errorText + '. ' : ''
    const chipsError = props.errorChip ? props.errorChip : ''
    const msg = `${inputError}${chipsError}`
    return msg
  }

  return (
    <View style={[styles.container, props.style]}>
      {props.label ? (
        <Text
          size={12}
          type="semibold"
          style={{
            ...styles.label,
            color: props.errorText
              ? theme.colors.error
              : props.useDarkTheme
              ? theme.colors.white
              : theme.colors.textThinBlack,
          }}>
          {props.label}
          {props.isRequired && (
            <Text color="red" size={11}>
              *
            </Text>
          )}
        </Text>
      ) : null}
      <View style={styles.wrapInput}>
        <TextInput
          onSubmitEditing={() => {
            props.onSubmit && props.onSubmit(props.value)
          }}
          returnKeyType="done"
          onKeyPress={e => {
            props.onKeyPress && props.onKeyPress(e)
          }}
          ref={ref}
          value={props.value}
          editable={props.disabled}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          textAlignVertical={props.textAlignVertical}
          onChangeText={text => {
            let newText = props.isNumber ? numberOnly(text, false) : text
            props.onChangeText && props.onChangeText(newText)
          }}
          style={[
            styles.input,
            props.useDarkTheme && styles.inputDarkTheme,
            props.value ? styles.haveValue : null,
            dynamicStyle,
            borderColor,
            styles[props.type || 'default'],
            props.style,
          ]}
          placeholderTextColor={props.useDarkTheme ? theme.colors.thirdWhiteTransparent : theme.colors.darkGray}
          onFocus={() => setState({...state, focus: true})}
          onBlur={() => setState({...state, focus: false})}
          keyboardType={props.isNumber ? 'phone-pad' : 'default'}
          autoCapitalize={props.uppercase ? 'characters' : 'none'}
          secureTextEntry={props.isPassword ? state.hide : false}
        />
        <TouchableOpacity
          onPress={() => {
            props.onSubmit && props.onSubmit(props.value)
          }}
          style={styles.addButton}>
          <Feather color={theme.colors.grey} name="plus" size={20} />
        </TouchableOpacity>
      </View>

      {(props.errorChip || props.errorText) && <Text style={styles.error}>{constructErrorMessage()}</Text>}

      {props.chipItems && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipItemsView}>
          {props.chipItems.map((f: any, i: number) => (
            <RemovableChip key={i} text={f[props.chipItemKey]} onRemoveTap={() => props.onChipRemove(f, i)} />
          ))}
        </ScrollView>
      )}
    </View>
  )
})

export default memo(TextInputChip)

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputDarkTheme: {
    backgroundColor: theme.colors.inputDarkTheme,
  },
  input: {
    color: theme.colors.textThinBlack,
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
    flex: 1,
  },
  labelDarkTheme: {
    color: theme.colors.white,
  },
  label: {
    color: theme.colors.textThinBlack,
    marginBottom: 6,
  },
  wrapInput: {flexDirection: 'row'},
  error: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 11,
    paddingTop: 4,
  },
  wrapIcon: {
    zIndex: 5,
    elevation: 5,
  },
  icon: {
    zIndex: 5,
    position: 'absolute',
    resizeMode: 'contain',
    width: 35,
    height: 26,
    left: 17,
    top: 15,
    bottom: 8,
  },
  round: {
    borderRadius: 25,
  },
  default: {
    borderRadius: 10,
  },
  addButton: {position: 'absolute', right: 18, top: 14, backgroundColor: '#EAEBEC', padding: 2, borderRadius: 6},
  haveValue: {
    fontStyle: 'normal',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
  },
  chipItemsView: {
    paddingTop: 8,
    flexDirection: 'row',
  },
})
