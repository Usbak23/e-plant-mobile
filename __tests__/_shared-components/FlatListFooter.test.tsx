import React from 'react'
import {render} from '@testing-library/react-native'
import FlatListFooter from '@app/presentations/_shared-components/FlatListFooter'

describe('FlatListFooteer', () => {
  it('should render correctly', () => {
    const component = render(<FlatListFooter loading={true} />)
    expect(component).toMatchSnapshot()
  })
})
