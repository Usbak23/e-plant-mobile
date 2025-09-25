import React from 'react'
import renderer from 'react-test-renderer'
import {Button, Text} from '@app/presentations/_shared-components'

describe('Button', () => {
  describe('Rendering', () => {
    it('should match to snapshot - Button', () => {
      const button = renderer.create(<Button mode="default" />)
      const butttonOutlined = renderer.create(<Button mode="outlined" />)
      const buttonText = renderer.create(<Button mode="link" />)
      const buttonWithChildren = renderer.create(
        <Button>
          <Text type="thin">Button Contained</Text>
        </Button>,
      )
      const disable = renderer.create(<Button disabled={true} />)

      expect({
        button,
        butttonOutlined,
        buttonText,
        buttonWithChildren,
        disable,
      }).toMatchSnapshot('button snapshot')
    })
  })
})
