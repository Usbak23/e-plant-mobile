import React from 'react'
import {ImageStyle, StyleProp, TextStyle, View} from 'react-native'
import {render} from '@testing-library/react-native'
import {AutoCompleteTextInput} from '@app/presentations/_shared-components'
import {useForm} from 'react-hook-form'

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

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
    handleSubmit: () => jest.fn(),
  }),
}))

function renderComponent(props: Props) {
  const component = render(
    <View>
      <AutoCompleteTextInput {...props} />
    </View>,
  )
  return {
    component,
    ...component,
  }
}

describe('AutoCompleteTextInput component', () => {
  it('Should render correctly', () => {
    const {control} = useForm({
      mode: 'onChange',
      defaultValues: {
        driver: '',
      },
    })
    const component = renderComponent({
      control: control,
      name: 'driver',
    })
    expect(component).toMatchSnapshot()
  })
})
