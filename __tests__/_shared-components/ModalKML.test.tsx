import {ModalKML} from '@app/presentations/_shared-components'
import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'

interface IModalKMLProps {
  isOpen?: boolean
  onTouchOutside: () => void
  onChooseFile?: () => void
  fileChoosed?: any
}

function renderComponent(props: IModalKMLProps) {
  const component = render(<ModalKML {...props} />)
  return {
    component,
    ...component,
  }
}

describe('ModalKMLComponent', () => {
  it('Should render correctly', () => {
    const {component} = renderComponent({
      onTouchOutside: () => {},
    })
    expect(component).toMatchSnapshot()
  })

  it('Should have correct behavior', async () => {
    const onTouchOutsideFn = jest.fn()
    const {component, getByTestId} = renderComponent({
      onTouchOutside: onTouchOutsideFn,
    })

    await waitFor(() => {
      expect(getByTestId('onTouchOutsideButton')).toBeTruthy()
    })

    fireEvent.press(getByTestId('onTouchOutsideButton'))
    expect(onTouchOutsideFn).toBeCalled()
  })
})
