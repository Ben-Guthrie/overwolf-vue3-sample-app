import { createApp } from 'vue'
import BackgroundApp from '@/windows/background/BackgroundApp.vue'
import { getSharedPinia } from '@/stores'

const backgroundApp = createApp(BackgroundApp)
backgroundApp.use(getSharedPinia())
backgroundApp.mount('#backgroundApp')
