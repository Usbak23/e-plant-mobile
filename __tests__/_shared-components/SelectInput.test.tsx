import {IProps} from '@app/presentations/types'
import React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {SelectInput} from '@app/presentations/_shared-components'

type item = {
  value: string
  label: string
}

interface IPSelectInput extends IProps {
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

function renderComponent(props: IPSelectInput) {
  const component = render(<SelectInput {...props} />)
  return {
    component,
    ...component,
  }
}

describe('SelectInput component', () => {
  it('Should render correctly', () => {
    const {component} = renderComponent({
      items: [],
    })
    expect(component).toMatchSnapshot()
  })

  it('Should show passed parameter', () => {
    const {component, queryAllByText} = renderComponent({
      items: [],
      label: 'Label',
      disabled: true,
      disabledText: 'Disabled',
    })

    expect(queryAllByText('Label').length).toBe(1)
    expect(queryAllByText('Disabled').length).toBe(1)
  })
})
