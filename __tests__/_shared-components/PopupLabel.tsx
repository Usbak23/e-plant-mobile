import {PopupLabel} from '@app/presentations/_shared-components'
import {render, waitFor} from '@testing-library/react-native'
import React from 'react'

interface IPopupLabelProps {
  text: string
  isSelected: boolean
}

function renderComponent(props: IPopupLabelProps) {
  const component = render(<PopupLabel {...props} />)
  return {
    component,
    ...component,
  }
}

describe('PopupLabel component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      isSelected: false,
      text: 'Lorem',
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Lorem')).toBeTruthy()
    })
  })
})
