import { createApp } from 'vue'
import InGameApp from '@/windows/in-game/InGameApp.vue'
import { getSharedPinia } from '@/stores'

const inGameApp = createApp(InGameApp)
inGameApp.use(getSharedPinia())
inGameApp.mount('#inGameApp')
