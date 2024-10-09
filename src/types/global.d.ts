import { Pinia } from 'pinia'

declare global {
  interface Window {
    sharedPinia: Pinia
  }
}
