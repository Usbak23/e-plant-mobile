import {IProps} from '@app/presentations/types'
import {TouchableTextInput} from '@app/presentations/_shared-components'
import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'

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

function renderComponent(props: IPTextInput) {
  const component = render(<TouchableTextInput {...props} />)
  return {
    component,
    ...component,
  }
}

describe('TouchableTextInput component', () => {
  it('Should render correctly', () => {
    const {component} = renderComponent({
      label: 'Label',
      onChangeText: v => {},
    })
    expect(component).toMatchSnapshot()
  })
  it('Should have correct behavior', async () => {
    const onPressFn = jest.fn()
    const {component, queryAllByText, getByTestId} = renderComponent({
      label: 'Label',
      onPress: onPressFn,
      onChangeText: v => {},
    })
    expect(component).toMatchSnapshot()
    expect(queryAllByText('Label')).toHaveLength(1)

    await waitFor(() => {
      expect(getByTestId('touchabletextinput-inputContainer')).toBeTruthy()
    })

    fireEvent.press(getByTestId('touchabletextinput-inputContainer'))
    expect(onPressFn).toBeCalled()
  })
})
