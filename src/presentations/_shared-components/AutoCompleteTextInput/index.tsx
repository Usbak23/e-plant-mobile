import React from 'react'
import {TextInput, View, TextStyle, StyleProp, ImageStyle, FlatList} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {theme} from '@utils/styles'
import {Text, DisabledInput} from './../index'
import styles from './styles'
import {Controller} from 'react-hook-form'
import numberOnly from '@app/presentations/utils/numberOnly'
import CurrencyInput from 'react-native-currency-input'
import {TouchableOpacity} from 'react-native-gesture-handler'

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
  items?: string[]
}

const AutoCompleteTextInput = React.forwardRef<TextInput, Props>((props, ref) => {
  const [state, setState] = React.useState({
    hide: true,
    focus: false,
    hideFlatList: false,
  })

  const dynamicStyle = {
    borderColor: props.errorText ? theme.colors.error : theme.colors.defaultBorderColor,
  }

  const borderColor = state.focus && !props.errorText ? {borderColor: theme.colors.accent} : {}

  if (props.disabled) {
    return (
      <DisabledInput label={props.label} hideIcon isRequired value={props.disabledText} errorText={props.errorText} />
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
              <View style={{flex: 1}}>
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
                    setState({...state, hideFlatList: false})
                    if (props.isNumber && !props.isFloat) {
                      const filteredText = numberOnly(text, false)
                      props.onChangeText && props.onChangeText(filteredText)
                      onChange(filteredText)
                      return
                    }

                    if (props.isNumber && props.isFloat) {
                      if (text) {
                        const filteredText = numberOnly(text, true)
                        const validated = filteredText.match(/^(\d*\.{0,1}\d{0,3}$)/)
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
                    styles.input,
                    props.useDarkTheme && styles.inputDarkTheme,
                    value || props.value ? styles.haveValue : null,
                    dynamicStyle,
                    borderColor,
                    styles[props.type || 'default'],
                    props.style,
                  ]}
                  placeholderTextColor={props.useDarkTheme ? theme.colors.thirdWhiteTransparent : undefined}
                  onFocus={() => setState({...state, focus: true})}
                  onBlur={() => setState({...state, focus: false})}
                  keyboardType={props.isNumber ? 'phone-pad' : 'default'}
                  autoCapitalize={props.uppercase ? 'characters' : 'none'}
                  secureTextEntry={props.isPassword ? state.hide : false}
                />
                {value && value != '' && !state.hideFlatList && state.focus ? (
                  <FlatList
                    style={{
                      maxHeight: 120,
                      borderRadius: 6,
                      backgroundColor: theme.colors.pureWhite,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                      elevation: 2,
                    }}
                    nestedScrollEnabled={true}
                    data={props.items?.filter(i => i.toLowerCase().includes(value?.toLowerCase())) || []}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => {
                          props.onChangeText && props.onChangeText(item)
                          onChange(item)
                          setState({...state, hideFlatList: true})
                        }}>
                        <Text size={12} style={{padding: 12}}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : null}
              </View>
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

export default React.memo(AutoCompleteTextInput)
