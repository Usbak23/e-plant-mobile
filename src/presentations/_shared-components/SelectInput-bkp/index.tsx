import React, {useState} from 'react'
import {Platform, View, StyleProp, ViewStyle} from 'react-native'
import {theme} from '@styles'
import {IProps} from '@app/presentations/types'
import Feather from 'react-native-vector-icons/Feather'
import Text from '@components/Text'
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown'
import {Controller} from 'react-hook-form'
import {filterData} from '@app/presentations/utils/filterData'
import styles from './styles'

type item = {
  value: string
  label: string
}

interface IPSelectInput {
  label?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  isRequired?: boolean
  errorText?: string
  items: item[]
  onChange?: (item: string) => void
  control: any
  name: string
  defaultValue?: string
  style?: StyleProp<ViewStyle>
  zIndex: number
}

const SelectInput = (props: IPSelectInput) => {
  const {
    onChange,
    items,
    label,
    value,
    errorText,
    disabled,
    isRequired,
    placeholder,
    control,
    name,
    defaultValue,
    style,
    zIndex,
  } = props

  const [state, setState] = useState({
    focus: false,
    search: '',
    value: '',
  })

  const dataSet = items.map(e => ({id: e.value, title: e.label}))
  const filteredDataSet = filterData(dataSet, state.search)

  const handleChange = (val: string) => {
    setState({...state, value: val})
    onChange && onChange(val || '')
  }

  const dynamicStyle = {
    ...(state.focus && Platform.OS === 'ios' && styles.focused),
    ...(!!errorText && styles.error),
  }

  const labelStyle = {
    ...styles.label,
    color: errorText ? theme.colors.error : theme.colors.textThinBlack,
  }

  return (
    <View style={[styles.container, {zIndex, elevation: zIndex}, style]}>
      <Text color={theme.colors.label} style={styles.label}>
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
      <Controller
        control={control}
        render={({field: {onChange: change, value: fieldValue}}) => (
          <AutocompleteDropdown
            initialValue={fieldValue}
            dataSet={filteredDataSet}
            showClear={state.focus}
            clearOnFocus={false}
            useFilter={false}
            debounce={200}
            showChevron
            closeOnSubmit
            onChangeText={search => setState({...state, search})}
            onFocus={() => setState({...state, focus: true})}
            onBlur={() => setState({...state, focus: false})}
            onSelectItem={item => {
              if (item) {
                change(item.id)
                handleChange(item.id)
              }
            }}
            onClear={() => {
              change('')
              handleChange('')
            }}
            textInputProps={{
              disabled,
              placeholder,
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {...styles.select, ...dynamicStyle, ...(Boolean(fieldValue || state.search) && styles.onValue)},
            }}
            rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
            suggestionsListContainerStyle={styles.suggestionsListContainerStyle}
            //@ts-ignore
            renderItem={(item: any) => {
              const selected = Boolean(item.id === fieldValue)
              return (
                <View
                  key={item.id}
                  style={[
                    styles.item,
                    {
                      backgroundColor: selected ? theme.colors.accentTransparent : undefined,
                    },
                  ]}>
                  <Text
                    size={12}
                    style={[
                      styles.textItem,
                      {
                        color: selected ? theme.colors.accent : theme.colors.primary,
                      },
                    ]}>
                    {item.title}
                  </Text>
                </View>
              )
            }}
            ChevronIconComponent={<Feather name="chevron-down" size={18} color={theme.colors.textThinBlack} />}
            ClearIconComponent={<Feather name="x-circle" size={18} color={theme.colors.textThinBlack} />}
            inputHeight={55}
          />
        )}
        name={name}
        defaultValue={defaultValue}
      />
      {errorText && (
        <View style={styles.rowCenter}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  )
}

export default SelectInput
