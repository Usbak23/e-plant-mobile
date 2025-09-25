import {IProps} from '@app/presentations/types'
import {Text} from '@app/presentations/_shared-components'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import React, {ReactNode} from 'react'

interface IPText extends IProps {
  type?: 'default' | 'thin' | 'regular' | 'semibold' | 'bold'
  color?: string
  size?: number
  children: string | ReactNode | null
  maxLines?: number
  onPress?: () => void
}

function renderComponent(props: IPText) {
  const component = render(<Text {...props} />)
  return {
    component,
    ...component,
  }
}

describe('Text component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      children: 'Text',
      onPress: onPressFn,
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Text')).toBeTruthy()
    })

    fireEvent.press(component.getByText('Text'))
    expect(onPressFn).toBeCalled()
  })
})
