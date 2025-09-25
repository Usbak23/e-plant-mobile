import {MoreButton} from '@app/presentations/_shared-components'
import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'

interface Props {
  label: string
  onTap: () => void
  hideIcon?: boolean
}

function renderComponent(props: Props) {
  const component = render(<MoreButton {...props} />)
  return {
    component,
    ...component,
  }
}

describe('MoreButton component', () => {
  it('Should render correctly', () => {
    const {component} = renderComponent({
      label: 'My label',
      onTap: () => {},
    })
    expect(component).toMatchSnapshot()
  })
  it('Should have correct behavior', async () => {
    const onTapFn = jest.fn()
    const {component, getByTestId, queryAllByText} = renderComponent({
      label: 'My label',
      onTap: onTapFn,
    })

    await waitFor(() => {
      expect(getByTestId('onTapButton')).toBeTruthy()
    })

    fireEvent.press(getByTestId('onTapButton'))
    expect(onTapFn).toBeCalled()

    expect(queryAllByText('My label').length).toBe(1)
  })
})
