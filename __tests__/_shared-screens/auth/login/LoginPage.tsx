import {render, waitFor} from '@testing-library/react-native'
import React from 'react'
import flux from '@app/domain/states/store'
import {Provider as ReduxProvider} from 'react-redux'
import * as reactRedux from 'react-redux'
import {createStore} from 'redux'
import {createReducer} from 'typesafe-actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Text, View} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import ProfilePage from '@app/presentations/screens/shared-screens/profile'
import {MenuProvider} from 'react-native-popup-menu'
import Login from '@app/presentations/screens/shared-screens/auth/login'

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')

const mockedNavigate = (): void => {
  jest.fn()
}

jest.mock('@react-navigation/core', () => {
  return {
    ...jest.requireActual('@react-navigation/core'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
    useIsFocused: () => false,
  }
})

function renderComponent() {
  const mockReducer = createReducer({
    user: {
      userDataLogin: {},
    },
  })
  const component = render(
    <MenuProvider>
      <reactRedux.Provider store={createStore(mockReducer)}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </reactRedux.Provider>
    </MenuProvider>,
  )
  return {
    component,
    ...component,
  }
}

describe('SharedScreen.LoginPage', () => {
  it('should render correctly', () => {
    const {component} = renderComponent()
    expect(component).toMatchSnapshot()
  })
})
