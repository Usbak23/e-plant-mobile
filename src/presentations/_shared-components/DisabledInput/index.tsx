import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Text} from '..'
import {RFValue as fs} from 'react-native-responsive-fontsize'

interface IDisabledInputProps {
  label?: string
  isRequired?: boolean
  errorText?: string
  value?: string
  hideIcon?: boolean
  hideLabel?: boolean
  labelMaxLine?: number
  maxLines?: number
}

const DisabledInput: React.FC<IDisabledInputProps> = props => {
  const {label, isRequired, errorText, value, hideLabel} = props

  const dynamicStyle = {
    ...(!!errorText && styles.error),
  }

  const labelStyle = {
    ...styles.label,
    color: errorText ? theme.colors.error : theme.colors.textThinBlack,
  }
  return (
    <View style={styles.root}>
      {!hideLabel && (
        <Text maxLines={props.labelMaxLine} color={theme.colors.label} style={styles.label}>
          {label ? (
            <Text size={12} type="semibold" style={labelStyle}>
              {label}
              {isRequired && (
                <Text color="red" size={11}>
                  *
                </Text>
              )}
            </Text>
          ) : null}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          backgroundColor: theme.colors.lightGrey,
          borderRadius: 8,
          padding: 14,
          borderColor: theme.colors.grey,
        }}>
        <Text maxLines={props.maxLines} size={11} color={theme.colors.grey}>
          {value}
        </Text>
        <View
          style={{
            marginEnd: 16,
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {props.hideIcon ? null : <Icon name={'chevron-down'} size={18} color={theme.colors.grey} />}
        </View>
      </View>
      {props?.errorText ? <Text style={styles.errorLabel}>{props.errorText}</Text> : null}
    </View>
  )
}

export default DisabledInput

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    color: theme.colors.textThinBlack,
    marginBottom: 6,
  },
  error: {
    color: theme.colors.error,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  errorLabel: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    fontSize: 11,
    paddingTop: 4,
  },
  errorText: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    marginTop: -5,
    fontSize: fs(11),
  },
})
