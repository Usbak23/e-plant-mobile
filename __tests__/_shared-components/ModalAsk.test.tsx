import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {ModalAsk} from '@app/presentations/_shared-components'

const positiveButtonFn = jest.fn()
const onTouchOutsideFn = jest.fn()

interface IModalAskProps {
  isOpen?: boolean
  onTouchOutside: () => void
  isDanger?: boolean
  title: string
  description: string
  positiveButtonText: string
  onPositiveButtonTap: () => void
}

function renderComponent(props: IModalAskProps) {
  const component = render(<ModalAsk {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ModalAsk component', () => {
  it('Should render correctly', async () => {
    const {component, queryAllByText, getByTestId} = renderComponent({
      title: 'My title',
      description: 'My description',
      positiveButtonText: 'Positive button',
      onPositiveButtonTap: positiveButtonFn,
      onTouchOutside: onTouchOutsideFn,
    })
    expect(component).toMatchSnapshot()
    expect(queryAllByText('My title').length).toBe(1)
    expect(queryAllByText('My description').length).toBe(1)
    expect(queryAllByText('Positive button').length).toBe(1)
    await waitFor(() => {
      expect(getByTestId('modalAskPositiveButton')).toBeTruthy()
      expect(getByTestId('modalAskOnTouchOutside')).toBeTruthy()
    })
    fireEvent.press(getByTestId('modalAskPositiveButton'))
    fireEvent.press(getByTestId('modalAskOnTouchOutside'))
    expect(positiveButtonFn).toBeCalled()
    expect(onTouchOutsideFn).toBeCalled()
  })
})
