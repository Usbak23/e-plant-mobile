import ModalFilter from '@app/presentations/_shared-components/ModalFilter'
import React, {ReactNode} from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {Text} from '@app/presentations/_shared-components'

interface IModalFilterProps {
  isOpen?: boolean
  onTouchOutside: () => void
  children?: ReactNode
}

function renderComponent(props: IModalFilterProps) {
  const component = render(<ModalFilter {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ModalFilter component', () => {
  it('Should render correctly', () => {
    const c = renderComponent({
      onTouchOutside: () => {},
    })
    expect(c).toMatchSnapshot()
  })

  it('Should call passed fn', async () => {
    const onTouchOutsideFn = jest.fn()
    const {component, getByTestId} = renderComponent({
      onTouchOutside: onTouchOutsideFn,
    })
    await waitFor(() => {
      expect(getByTestId('touchOutsideButton')).toBeTruthy()
    })

    fireEvent.press(getByTestId('touchOutsideButton'))
    expect(onTouchOutsideFn).toBeCalled()
  })

  it('Should render the children', () => {
    const {component, queryAllByText} = renderComponent({
      onTouchOutside: () => {},
      children: <Text>Lorem ipsum</Text>,
    })

    expect(queryAllByText('Lorem ipsum').length).toBe(1)
  })
})
