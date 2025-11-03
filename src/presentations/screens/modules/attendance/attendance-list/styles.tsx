import {theme} from '@app/presentations/utils/styles'
import React from 'react'
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  filter: {
    marginVertical: 8,
  },
  popupLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    padding: 8,
  },

  syncView: {
    marginVertical: 8,
    backgroundColor: theme.colors.tealSemiTransparent,
    justifyContent: 'space-between',
    // flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
})

export default styles
