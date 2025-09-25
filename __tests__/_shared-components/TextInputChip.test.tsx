import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react-native'
import {ImageStyle, StyleProp, TextStyle} from 'react-native'
import {TextInputChip} from '@app/presentations/_shared-components'

interface ITextInputChipProps {
  type?: 'round' | 'default'
  isPassword?: boolean
  isNumber?: boolean
  uppercase?: boolean
  isRequired?: boolean
  errorText?: string
  errorChip?: string
  label?: string
  icon?: any
  disabled?: boolean
  multiline?: boolean
  textAlignVertical?: 'auto' | 'bottom' | 'center' | 'top'
  numberOfLines?: number
  iconStyle?: StyleProp<ImageStyle>
  style?: StyleProp<TextStyle>
  value?: string
  defaultValue?: string
  placeholder?: string
  autoFocus?: boolean
  onChangeText?: (text: string) => void
  useDarkTheme?: boolean
  onKeyPress?: (event: any) => void
  onSubmit?: (currentValue: string | undefined) => void
  chipItems: any
  onChipRemove: (chipValue: any, index: number) => void
  chipItemKey: string
}

function renderComponent(props: ITextInputChipProps) {
  const component = render(<TextInputChip {...props} />)
  return {
    component,
    ...component,
  }
}

describe('TextInputChip component', () => {
  it('Should render correctly', () => {
    const {component} = renderComponent({
      chipItemKey: 'chipItemKey',
      chipItems: [],
      onChipRemove: () => {},
    })
    expect(component).toMatchSnapshot()
  })
  it('Should have correct behavior', async () => {
    const onRemoveFn = jest.fn()
    const {component, queryAllByText, getByTestId} = renderComponent({
      chipItemKey: 'chipItemKey',
      chipItems: [
        {
          id: '1',
          value: 'item 1',
          chipItemKey: 'item 1',
        },
        {
          id: '2',
          value: 'item 2',
          chipItemKey: 'item 2',
        },
      ],
      onChipRemove: onRemoveFn,
    })
    expect(component).toMatchSnapshot()

    await waitFor(() => {
      expect(queryAllByText('item 1')).toHaveLength(1)
      expect(getByTestId('removeChip-item 1')).toBeTruthy()
    })

    fireEvent.press(getByTestId('removeChip-item 1'))
    expect(onRemoveFn).toBeCalled()
  })
})
