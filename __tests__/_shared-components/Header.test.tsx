import React from 'react'
import {StyleProp, View, ViewStyle} from 'react-native'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {Header, Text} from '@app/presentations/_shared-components'

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

interface IHeaderProps {
  title: string
  headerRight?: () => JSX.Element | false | undefined
  onGoBack?: () => void
  hideBackButton?: boolean
  style?: StyleProp<ViewStyle>
}

function renderComponent(props: IHeaderProps) {
  const component = render(<Header {...props} />)
  return {
    component,
    ...component,
  }
}

describe('Header component', () => {
  it('Should render correctly', () => {
    const component = renderComponent({
      title: 'My Header',
    })
    expect(component).toMatchSnapshot()
  })

  it('Should have correct behavior', async () => {
    const props: IHeaderProps = {
      title: 'My Header',
      onGoBack: onGoBack,
    }
    const {component, getByTestId, queryAllByText} = renderComponent(props)
    expect(component).toMatchSnapshot()

    expect(queryAllByText('My Header').length).toBe(1)

    await waitFor(() => {
      expect(getByTestId('headerBackButton')).toBeTruthy()
    })
    fireEvent.press(getByTestId('headerBackButton'))
    expect(onGoBack).toBeCalled()
  })

  it('Should render right content', () => {
    const props: IHeaderProps = {
      title: 'My Header',
      headerRight: () => (
        <View>
          <Text>Right Content</Text>
        </View>
      ),
    }
    const {component, queryAllByText} = renderComponent(props)
    expect(component).toMatchSnapshot()
    expect(queryAllByText('Right Content').length).toBe(1)
  })
})
