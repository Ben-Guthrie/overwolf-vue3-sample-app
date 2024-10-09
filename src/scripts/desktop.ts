import { createApp } from 'vue'
import DesktopApp from '@/windows/desktop/DesktopApp.vue'
import { getSharedPinia } from '@/stores'

const desktopApp = createApp(DesktopApp)
desktopApp.use(getSharedPinia())
desktopApp.mount('#desktopApp')
