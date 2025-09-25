import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import ProfileRightHeader from '@app/presentations/_shared-components/ProfileRightHeader'
import * as reactRedux from 'react-redux'
import {createStore} from 'redux'
import {createReducer} from 'typesafe-actions'

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
describe('ProfileRightHeader component', () => {
  beforeEach(() => {
    useSelectorMock.mockClear()
  })
  it('Should render correctly', () => {
    const mockReducer = createReducer({})

    const component = render(
      <reactRedux.Provider store={createStore(mockReducer)}>
        <ProfileRightHeader />
      </reactRedux.Provider>,
    )
    expect(component).toMatchSnapshot()
  })
})
