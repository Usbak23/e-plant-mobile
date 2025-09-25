import {TextInput} from '@app/presentations/_shared-components'
import React from 'react'
import {ImageStyle, StyleProp, TextStyle} from 'react-native'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
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
  const component = render(<TextInput {...props} />)
  return {
    component,
    ...component,
  }
}

describe('TextInput component', () => {
  it('Should render correctly', () => {
    const {control} = useForm({
      mode: 'onChange',
      defaultValues: {
        myTextInput: '',
      },
    })
    const {component} = renderComponent({
      control,
      name: 'myTextInput',
    })
    expect(component).toMatchSnapshot()
  })

  it('Should have correct behavior', () => {
    const {control} = useForm({
      mode: 'onChange',
      defaultValues: {
        myTextInput: '',
      },
    })
    const {component, queryAllByText} = renderComponent({
      control,
      isRequired: false,
      name: 'myTextInput',
      label: 'My Label',
    })
    expect(component).toMatchSnapshot()
    expect(queryAllByText('My Label').length).toBe(1)
  })
})
