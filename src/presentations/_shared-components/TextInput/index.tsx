import React from 'react'
import {TextInput, View, TextStyle, StyleProp, ImageStyle, TouchableOpacity} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {theme} from '@utils/styles'
import {Text, DisabledInput} from './../index'
import styles from './styles'
import {Controller} from 'react-hook-form'
import numberOnly from '@app/presentations/utils/numberOnly'
import CurrencyInput from 'react-native-currency-input'

interface Props {
  type?: 'round' | 'default'
  isPassword?: boolean
  isNumber?: boolean
  isFloat?: boolean
  precisionDigit?: number
  uppercase?: boolean
  isRequired?: boolean
  errorText?: string
  label?: string
  icon?: any
  control: any
  disabled?: boolean
  multiline?: boolean
  textAlignVertical?: 'auto' | 'bottom' | 'center' | 'top'
  numberOfLines?: number
  iconStyle?: StyleProp<ImageStyle>
  style?: StyleProp<TextStyle>
  value?: string
  name: string
  defaultValue?: string
  placeholder?: string
  autoFocus?: boolean
  onChangeText?: (text: string) => void
  useDarkTheme?: boolean
  isCurrency?: boolean
  disabledText?: string
  maxLines?: number
}

const CustomTextInput = React.forwardRef<TextInput, Props>((props, ref) => {
  const [state, setState] = React.useState({
    hide: true,
    focus: false,
  })

  const dynamicStyle = {
    borderColor: props.errorText ? theme.colors.error : theme.colors.defaultBorderColor,
  }

  const borderColor = state.focus && !props.errorText ? {borderColor: theme.colors.accent} : {}

  if (props.disabled) {
    return (
      <DisabledInput
        maxLines={props.maxLines}
        label={props.label}
        hideIcon
        isRequired={props.isRequired}
        value={props.disabledText}
        errorText={props.errorText}
      />
    )
  }

  return (
    <View style={[styles.container, props.style]}>
      {props.label ? (
        <Text
          maxLines={props.maxLines}
          type="semibold"
          size={12}
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
        <Controller
          control={props?.control}
          render={({field: {onChange, value}}) => {
            if (props.isCurrency) {
              return (
                <CurrencyInput
                  value={value || props.value}
                  onChangeValue={text => {
                    let newText = props.isNumber ? numberOnly(text, false) : text
                    props.onChangeText && props.onChangeText(newText)
                    onChange(newText)
                  }}
                  prefix="Rp"
                  delimiter=","
                  separator="."
                  placeholderTextColor={theme.colors.grey}
                  placeholder="Rp. 500.000"
                  minValue={0}
                  precision={0}
                  onChangeText={formattedValue => {}}
                  style={[
                    styles.input,
                    props.useDarkTheme && styles.inputDarkTheme,
                    value || props.value ? styles.haveValue : null,
                    dynamicStyle,
                    borderColor,
                    styles[props.type || 'default'],
                    props.style,
                  ]}
                />
              )
            }
            return (
              <TextInput
                ref={ref}
                value={value || props.value}
                editable={!props.disabled}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus}
                textAlignVertical={props.textAlignVertical}
                onChangeText={text => {
                  if (props.isNumber && !props.isFloat) {
                    const filteredText = numberOnly(text, false)
                    props.onChangeText && props.onChangeText(filteredText)
                    onChange(filteredText)
                    return
                  }

                  if (props.isNumber && props.isFloat) {
                    if (text) {
                      const filteredText = numberOnly(text, true)
                      const validated = filteredText.match(/^(\d*\.{0,1}\d{0,2}$)/)
                      if (validated) {
                        props.onChangeText && props.onChangeText(filteredText)
                        onChange(filteredText)
                      }
                    } else {
                      const filteredText = numberOnly(text, true)
                      props.onChangeText && props.onChangeText(filteredText)
                      onChange(filteredText)
                    }
                    return
                  }

                  props.onChangeText && props.onChangeText(text)
                  onChange(text)
                }}
                style={[
                  props?.multiline ? styles.inputMultiline : styles.input,
                  props.useDarkTheme && styles.inputDarkTheme,
                  value || props.value ? styles.haveValue : null,
                  dynamicStyle,
                  borderColor,
                  styles[props.type || 'default'],
                  props.style,
                ]}
                placeholderTextColor={props?.useDarkTheme ? theme.colors.thirdWhiteTransparent : theme.colors.darkGray}
                onFocus={() => setState({...state, focus: true})}
                onBlur={() => setState({...state, focus: false})}
                keyboardType={props.isNumber ? 'phone-pad' : 'default'}
                autoCapitalize={props.uppercase ? 'characters' : 'none'}
                secureTextEntry={props.isPassword ? state.hide : false}
              />
            )
          }}
          name={props.name}
          defaultValue={props.defaultValue}
        />
        {props.isPassword && (
          <TouchableOpacity onPress={() => setState({...state, hide: !state.hide})} style={styles.hideButton}>
            <Feather color={theme.colors.grey} name={state.hide ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {props?.errorText ? <Text style={styles.error}>{props.errorText}</Text> : null}
    </View>
  )
})

export default React.memo(CustomTextInput)
