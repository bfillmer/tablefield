
import React from 'react'
import {ThemeProvider} from 'styled-components'

import {Routing} from 'view/Routing'

import {theme} from 'view/theme'

export function Root () {
  return (
    <ThemeProvider theme={theme}>
      <Routing />
    </ThemeProvider>
  )
}
