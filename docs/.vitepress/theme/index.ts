import DefaultTheme from 'vitepress/theme'
import PasswordLayout from './PasswordLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: PasswordLayout
}
