import {theme} from '@app/presentations/utils/styles'
import {Menu} from '@app/presentations/_shared-components'
import {render, waitFor} from '@testing-library/react-native'
import React from 'react'
import IconExample from '@assets/icons/ic_fertilization.svg'

interface IMenuProps {
  menuItem: {
    icon: any
    title: string
    screen: string
    bgColor: string
  }
}

const mockedNavigate = (): void => {
  jest.fn()
}

const onGoBack = jest.fn()

jest.mock('@react-navigation/core', () => {
  return {
    ...jest.requireActual('@react-navigation/core'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})

function renderComponent(props: IMenuProps) {
  const component = render(<Menu {...props} />)
  return {
    component,
    ...component,
  }
}

describe('Menu component', () => {
  it('Should render correctly', async () => {
    const onPressFn = jest.fn()
    const {component} = renderComponent({
      menuItem: {
        bgColor: theme.colors.blue,
        icon: () => <IconExample width={24} height={24} />,
        title: 'Example',
        screen: 'Route',
      },
    })
    expect(component).toMatchSnapshot()
    await waitFor(() => {
      expect(component.getByText('Example')).toBeTruthy()
    })
  })
})
