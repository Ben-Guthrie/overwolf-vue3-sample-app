<template>
  <AppWindow :window-name="kWindowNames.inGame">
    <template #title>
      <h1>Sample App / in-game window</h1>
    </template>

    <template #body>
      <main>
        <div id="logs">
          <div id="events" class="logColumn">
            <h1>Game Events</h1>
            <div ref="eventsLog" class="dataText">
              <pre
                v-for="event in events"
                :key="event.event"
                :class="{ highlight: event.highlight }"
              >
                {{ event.event }}
              </pre>
            </div>
          </div>
          <div ref="infoUpdates" class="logColumn">
            <h1>Info Updates</h1>
            <div ref="infoLog" class="dataText">
              <pre v-for="info in infos" :key="info">
                {{ info }}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </template>
  </AppWindow>
</template>

<script setup lang="ts">
import { OWGames, OWGamesEvents, OWHotkeys } from '@overwolf/overwolf-api-ts'
import { kHotkeys, kWindowNames, kGamesFeatures } from '@/consts'
import { onMounted, ref, Ref, useTemplateRef } from 'vue'
import AppWindow from '../AppWindow.vue'
import { useBackgroundStore } from '@/stores'

// The window displayed in-game while a game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
const eventsLog = useTemplateRef('eventsLog')
const infoLog = useTemplateRef('infoLog')

const events: Ref<Array<{ event: string; highlight: boolean }>> = ref([])
const infos: Ref<Array<string>> = ref([])
let gameEventsListener: OWGamesEvents

onMounted(async () => {
  setToggleHotkeyBehavior()
  setToggleHotkeyText()

  const gameClassId = await getCurrentGameClassId()

  if (gameClassId !== null) {
    const gameFeatures = kGamesFeatures.get(gameClassId)
    if (gameFeatures && gameFeatures.length) {
      console.log('Listening for events: ', gameFeatures)
      gameEventsListener = new OWGamesEvents(
        {
          onInfoUpdates: onInfoUpdates,
          onNewEvents: onNewEvents
        },
        gameFeatures
      )

      gameEventsListener.start()
    }
  }
  // Get the current game info
  gameEventsListener.getInfo()
})

function onInfoUpdates(info: any) {
  infos.value.push(JSON.stringify(info))
  if (infoLog.value) autoScroll(infoLog.value)
}

// Special events will be highlighted in the event log
function onNewEvents(e: any) {
  const shouldHighlight = e.events.some((event: any) => {
    switch (event.name) {
      case 'kill':
      case 'death':
      case 'assist':
      case 'level':
      case 'matchStart':
      case 'match_start':
      case 'matchEnd':
      case 'match_end':
        return true
    }

    return false
  })
  events.value.push({ event: JSON.stringify(e), highlight: shouldHighlight })
  if (eventsLog.value) autoScroll(eventsLog.value)
}

// Displays the toggle minimize/restore hotkey in the window header
async function setToggleHotkeyText() {
  const gameClassId = await getCurrentGameClassId()
  const hotkeyText = await OWHotkeys.getHotkeyText(kHotkeys.toggle, gameClassId || 0)
  const hotkeyElem = document.getElementById('hotkey')
  if (hotkeyElem) hotkeyElem.textContent = hotkeyText
}

// Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
async function setToggleHotkeyBehavior() {
  const toggleInGameWindow = async (
    hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
  ): Promise<void> => {
    console.log(`pressed hotkey for ${hotkeyResult.name}`)
    useBackgroundStore().minimizeCurrentWindow()
  }

  OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow)
}

function autoScroll(log: HTMLElement) {
  // Check if scroll is near bottom
  const shouldAutoScroll = log.scrollTop + log.offsetHeight >= log.scrollHeight - 10

  if (shouldAutoScroll) {
    log.scrollTop = log.scrollHeight
  }
}

async function getCurrentGameClassId(): Promise<number | null> {
  const info = await OWGames.getRunningGameInfo()

  return info && info.isRunning && info.classId ? info.classId : null
}
</script>
