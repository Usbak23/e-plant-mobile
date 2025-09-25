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
import Dashboard from '@app/presentations/screens/shared-screens/dashboard'

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
  const mockReducer = createReducer({})
  const component = render(
    <reactRedux.Provider store={createStore(mockReducer)}>
      <NavigationContainer>
        <Dashboard />
      </NavigationContainer>
    </reactRedux.Provider>,
  )
  return {
    component,
    ...component,
  }
}

describe('SharedScreen.Dashboard', () => {
  beforeEach(() => {
    jest.mock('@react-native-community/netinfo')
    jest.mock('@react-native-async-storage/async-storage', () => {
      return {
        getItem: async (...args) => args,
        setItem: async (...args) => args,
        removeItem: async (...args) => args,
      }
    })
  })
  it('should render correctly ', () => {
    const {component} = renderComponent()
    expect(component).toMatchSnapshot()
  })
})
