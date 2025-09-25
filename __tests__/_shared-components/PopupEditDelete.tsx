import PopupEditDelete from '@app/presentations/_shared-components/PopupEditDelete'
import {render, waitFor} from '@testing-library/react-native'
import React from 'react'

interface IPopupEditDelete {
  text: string
  iconName?: string
  bgIconColor?: string
}

function renderComponent(props: IPopupEditDelete) {
  const component = render(<PopupEditDelete {...props} />)
  return {
    component,
    ...component,
  }
}

describe('PopupEditDelete component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      text: 'Lorem',
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Lorem')).toBeTruthy()
    })
  })
})
