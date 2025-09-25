import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {ModalInfo} from '@app/presentations/_shared-components'

interface IModalInfoProps {
  isDanger?: boolean
  isOpen?: boolean
  onTouchOutside: () => void
  title: string
  description?: string
  positiveButtonText?: string
  onPositiveButtonTap: () => void
}

function renderComponent(props: IModalInfoProps) {
  const component = render(<ModalInfo {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ModalInfo component', () => {
  it('Should render correctly', () => {
    const c = renderComponent({
      title: 'My title',
      onPositiveButtonTap: () => {},
      onTouchOutside: () => {},
    })
    expect(c).toMatchSnapshot()
  })

  it('Should have correcct behavior', async () => {
    const positiveButtonFn = jest.fn()
    const onTouchOutsideFn = jest.fn()
    const {component, getByTestId, queryAllByText} = renderComponent({
      title: 'My title',
      onPositiveButtonTap: positiveButtonFn,
      onTouchOutside: onTouchOutsideFn,
    })

    expect(queryAllByText('My title').length).toBe(1)
    await waitFor(() => {
      expect(getByTestId('onPositiveButton')).toBeTruthy()
      expect(getByTestId('onTouchOutsideButton')).toBeTruthy()
    })

    fireEvent.press(getByTestId('onPositiveButton'))
    fireEvent.press(getByTestId('onTouchOutsideButton'))
    expect(positiveButtonFn).toBeCalled()
    expect(onTouchOutsideFn).toBeCalled()
  })
})
