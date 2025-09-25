import {SortPopup} from '@app/presentations/_shared-components'
import {render, waitFor} from '@testing-library/react-native'
import React from 'react'
import {Menu, MenuProvider, MenuTrigger} from 'react-native-popup-menu'

interface ISortPopupProps {
  options: {
    value: string
    label: string
  }[]
  onSelect: (value: string) => void
  selectedValue: string
  title?: string
}

function renderComponent(props: ISortPopupProps) {
  const component = render(
    <MenuProvider>
      <Menu>
        <MenuTrigger>
          <SortPopup {...props} />
        </MenuTrigger>
      </Menu>
    </MenuProvider>,
  )
  return {
    component,
    ...component,
  }
}
describe('SortPopup component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      options: [],
      onSelect: onPressFn,
      selectedValue: '',
      title: 'My Title',
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('My Title')).toBeTruthy()
    })
  })
})
