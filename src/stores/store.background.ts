import { defineStore } from 'pinia'
import { OWGames, OWGameListener, OWWindow } from '@overwolf/overwolf-api-ts'
import { kWindowNames, kGameClassIds } from '@/consts'
import { computed, ref, watch } from 'vue'

type RunningGameInfo = overwolf.games.RunningGameInfo
type AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent
import WindowState = overwolf.windows.enums.WindowStateEx

export const useBackgroundStore = defineStore('background', () => {
  // The background store holds all of the app's background logic - hence its name. it has
  // many possible use cases, for example sharing data between windows, or, in our case,
  // managing which window is currently presented to the user. To that end, it holds a dictionary
  // of the windows available in the app.
  const mainWindow = new OWWindow('background')
  const windows: Record<string, OWWindow> = {
    [kWindowNames.desktop]: new OWWindow(kWindowNames.desktop),
    [kWindowNames.inGame]: new OWWindow(kWindowNames.inGame)
  }
  const currentWindowName = ref('none')
  const maximized = ref(false)
  const currentWindow = computed(() => windows[currentWindowName.value])

  // When a a supported game is started or is ended, toggle the app's windows
  const gameListener: OWGameListener = new OWGameListener({
    onGameStarted: toggleWindows,
    onGameEnded: toggleWindows
  })

  overwolf.extensions.onAppLaunchTriggered.addListener((e) => onAppLaunchTriggered(e))

  // Watch for changes in currentWindowName and swap windows when it changes
  watch(currentWindowName, (newValue, oldValue) => {
    console.log('Changing active window from', oldValue, 'to', newValue)
    if (oldValue in windows) windows[oldValue].close()
    if (newValue in windows) windows[newValue].restore()
  })

  // Start listening to game launch events
  gameListener.start()

  function onAppLaunchTriggered(e: AppLaunchTriggeredEvent) {
    console.log('onAppLaunchTriggered():', e)

    if (!e || e.origin.includes('gamelaunchevent')) {
      return
    }

    setInitialWindow()
  }

  async function setInitialWindow() {
    updateCurrentWindow(await isSupportedGameRunning())
  }

  function toggleWindows(info: RunningGameInfo) {
    if (!info || !isSupportedGame(info)) return
    updateCurrentWindow(info.isRunning)
  }

  function updateCurrentWindow(isInGame: boolean) {
    currentWindowName.value = isInGame ? kWindowNames.inGame : kWindowNames.desktop
  }

  async function isSupportedGameRunning(): Promise<boolean> {
    const info = await OWGames.getRunningGameInfo()
    if (!info) return false
    console.log('Game running: ', info.classId)

    return info && info.isRunning && isSupportedGame(info)
  }

  // Identify whether the RunningGameInfo object we have references a supported game
  function isSupportedGame(info: RunningGameInfo) {
    return kGameClassIds.includes(info.classId)
  }

  // Manage minimizing, closing, dragging and exiting windows
  async function minimizeCurrentWindow() {
    // Minimize or restore, depending on the current window state
    const windowState = await currentWindow.value.getWindowState()
    if (
      windowState.window_state === WindowState.normal ||
      windowState.window_state === WindowState.maximized
    ) {
      currentWindow.value.minimize()
    } else if (
      windowState.window_state === WindowState.minimized ||
      windowState.window_state === WindowState.closed
    ) {
      currentWindow.value.restore()
    }
  }

  function maximimizeCurrentWindow() {
    if (maximized.value) {
      currentWindow.value.maximize()
    } else {
      currentWindow.value.restore()
    }

    maximized.value = !maximized.value
  }

  function setCurrentWindowDrag(elem: HTMLElement) {
    currentWindow.value.dragMove(elem)
  }

  function exitApp() {
    mainWindow.close()
  }

  return {
    setInitialWindow,
    minimizeCurrentWindow,
    maximimizeCurrentWindow,
    setCurrentWindowDrag,
    exitApp
  }
})
