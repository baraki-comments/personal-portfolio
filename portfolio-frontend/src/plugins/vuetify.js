import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const theme = {
  dark: false,
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#B00020',
    info: '#2194F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: { light: theme }
  }
})
