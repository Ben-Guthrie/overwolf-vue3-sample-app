import { createPinia } from 'pinia'
import { useBackgroundStore as _useBackgroundStore } from './store.background'

export function getSharedPinia() {
  const mainWindow = overwolf.windows.getMainWindow()

  // If this is the main window, return the locally created pinia
  if (!mainWindow.sharedPinia) {
    const sharedPinia = createPinia()
    mainWindow.sharedPinia = sharedPinia
  }

  return mainWindow.sharedPinia
}

// Ensure all stores use the shared Pinia instance
// (app.use(getSharedPinia()) does not always correctly initialize the stores with the pinia state)
export const useBackgroundStore = () => _useBackgroundStore(getSharedPinia())
