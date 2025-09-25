import React from 'react'
import {StyleSheet, View, Image, Platform, StyleProp, ViewStyle} from 'react-native'
import {theme} from '@styles'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {IProps} from '@app/presentations/types'
import {Controller} from 'react-hook-form'
import MultiSelect from 'react-native-multiple-select'
import Text from '@components/Text'
import {DisabledInput} from '..'

type item = {
  value: string
  label: string
}

export interface IPSelectInput extends IProps {
  label?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  disabledText?: string
  noItemsText?: string
  disabledClickable?: boolean
  isRequired?: boolean
  errorText?: string
  items: item[]
  onChange?: (item: string) => void
  control?: any
  name?: string
  defaultValue?: string
  containerStyle?: StyleProp<ViewStyle>
  hideLabel?: boolean
  labelMaxLine?: number
}

const SelectInput = (props: IPSelectInput) => {
  const {
    onChange,
    items,
    label,
    containerStyle,
    value,
    errorText,
    disabled,
    isRequired,
    placeholder,
    control,
    noItemsText = 'Tidak ada data',
    name,
    disabledText,
    defaultValue,
    disabledClickable,
    hideLabel,
    labelMaxLine,
  } = props

  if (disabled && !disabledClickable) {
    return (
      <DisabledInput labelMaxLine={labelMaxLine} hideLabel={hideLabel} label={label} isRequired value={disabledText} />
    )
  }

  const handleChange = (val: string) => {
    onChange && onChange(val || '')
  }

  const dynamicStyle = {
    ...(!!errorText && styles.error),
  }

  const labelStyle = {
    ...styles.label,
    color: errorText ? theme.colors.error : theme.colors.textThinBlack,
  }

  const data = () => {
    if (isRequired) {
      return [...items]
    }
    return [{value: '', label: 'Kosong'}, ...items]
  }

  const Select = ({change, value}: any) => (
    <MultiSelect
      items={disabled ? [] : data()}
      uniqueKey="value"
      onSelectedItemsChange={val => {
        change && change(val[0])
        handleChange(val[0])
      }}
      selectedItems={[value]}
      selectText={placeholder}
      styleTextDropdown={[styles.textDropdown, {...(errorText && {color: theme.colors.error})}]}
      fontFamily={'OpenSans-SemiBold'}
      searchInputPlaceholderText="Search Items..."
      altFontFamily="OpenSans-Regular"
      styleRowText={styles.item}
      styleRowTextSelected={{color: theme.colors.accent}}
      styleWraperRowText={{
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 5,
      }}
      styleWraperRowTextSelected={{
        backgroundColor: theme.colors.accentTransparent,
      }}
      noItemsText={noItemsText}
      selectedItemTextColor={theme.colors.accent}
      selectedItemIconColor={theme.colors.accent}
      selectedItemFontFamily={'OpenSans-Regular'}
      styleListContainer={{height: 170}}
      styleDropdownMenuSubsection={{paddingRight: 0, right: 0}}
      styleTextDropdownSelected={[styles.textDropdown, {color: theme.colors.grey}, {...(value && styles.onValue)}]}
      styleItemsContainer={styles.suggestionsListContainerStyle}
      styleInputGroup={[styles.select, dynamicStyle]}
      styleDropdownMenu={[styles.select, dynamicStyle]}
      itemTextColor={theme.colors.primary}
      displayKey="label"
      searchInputStyle={{color: '#CCC'}}
      submitButtonColor={theme.colors.label}
      submitButtonText="Select"
      searchIcon={null}
      hideSubmitButton
      fixedHeight={true}
      hideTags
      single
    />
  )

  return (
    <View style={[styles.container, containerStyle]}>
      {!hideLabel && (
        <Text maxLines={labelMaxLine} color={theme.colors.label} style={styles.label}>
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

      {control ? (
        <Controller
          control={control}
          render={({field: {onChange: change, value: fieldValue}}) => <Select change={change} value={fieldValue} />}
          name={name}
          defaultValue={defaultValue || null}
        />
      ) : (
        <Select value={value} />
      )}
      {errorText && <Text style={styles.errorText}>{props.errorText}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  containerNoLabel: {
    width: '100%',
  },
  textDropdown: {
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
    fontStyle: 'italic',
    fontSize: 13,
    color: theme.colors.primary,
  },
  focused: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  error: {
    color: theme.colors.error,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: theme.colors.error,
    paddingHorizontal: 4,
    marginTop: -5,
    fontSize: fs(10),
  },
  errorIconImg: {
    marginTop: 4,
    marginRight: 5,
    height: 12,
    width: 12,
  },
  label: {
    color: theme.colors.textThinBlack,
    marginBottom: 6,
  },
  select: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: '#fff',
    fontFamily: Platform.OS !== 'ios' ? 'OpenSans-Regular' : undefined,
    fontStyle: 'italic',
    color: theme.colors.black,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    height: 50,
  },
  onValue: {
    fontStyle: 'normal',
    color: theme.colors.black,
  },
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
  iconError: {marginTop: 4, marginRight: 5},
  rightButtonsContainerStyle: {
    right: 8,
    height: 30,
    top: 10,
    backgroundColor: 'white',
  },
  suggestionsListContainerStyle: {
    marginTop: 5,
    backgroundColor: 'white',
    width: '99%',
    marginLeft: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  item: {
    fontSize: fs(12),
    fontFamily: 'OpenSans-Regular',
  },
  textItem: {paddingHorizontal: 10, paddingVertical: 4},
})

export default SelectInput
