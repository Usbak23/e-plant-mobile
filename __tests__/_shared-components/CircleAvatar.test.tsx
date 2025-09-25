import React from 'react'
import {render} from '@testing-library/react-native'
import CircleAvatar from '@app/presentations/_shared-components/CircleAvatar'

function renderComponent() {
  const component = render(<CircleAvatar />)
  return {
    component,
    ...component,
  }
}

describe('CircleAvatar component', () => {
  it('Should render correctly', () => {
    const component = renderComponent()
    expect(component).toMatchSnapshot()
  })
})
