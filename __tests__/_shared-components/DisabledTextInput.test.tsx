import React from 'react'
import {render} from '@testing-library/react-native'
import {View} from 'react-native'
import {DisabledInput} from '@app/presentations/_shared-components'

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

function renderComponent(props: IDisabledInputProps) {
  const component = render(
    <View>
      <DisabledInput {...props} />
    </View>,
  )
  return {
    component,
    ...component,
  }
}

describe('DisabledInput component', () => {
  it('Should render correctly', () => {
    const component = renderComponent({})
    expect(component).toMatchSnapshot()
  })
})
