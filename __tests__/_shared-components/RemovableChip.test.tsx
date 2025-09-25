import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {RemovableChip} from '@app/presentations/_shared-components'

describe('RemovableChip component', () => {
  it('Should render correctly', () => {
    const component = render(<RemovableChip text={'test'} />)
    expect(component).toMatchSnapshot()
  })
})
