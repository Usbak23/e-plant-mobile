import React from 'react'
import {render} from '@testing-library/react-native'
import {Loader} from '@app/presentations/_shared-components'

const mockedNavigate = (): void => {
  jest.fn()
}

jest.mock('@react-navigation/core', () => {
  return {
    ...jest.requireActual('@react-navigation/core'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})
function renderComponent() {
  const component = render(<Loader loading={true} />)
  return {
    component,
    ...component,
  }
}

describe('Loader component', () => {
  it('Should render correctly', () => {
    const c = renderComponent()
    expect(c).toMatchSnapshot()
  })
})
