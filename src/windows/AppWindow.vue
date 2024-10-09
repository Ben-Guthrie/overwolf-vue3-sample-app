<template>
  <!-- -------------------------------- Header ------------------------------- -->
  <header ref="header" class="app-header">
    <img src="/public/img/header_icon.svg" />
    <slot name="title" />
    <h1 class="hotkey-text" v-if="windowName == kWindowNames.inGame">
      Show/Hide Hotkey:
      <kbd id="hotkey"></kbd>
    </h1>
    <div class="window-controls-group">
      <button
        id="minimizeButton"
        class="window-control window-control-minimize"
        @click="onMinimizeClicked"
      />
      <button
        id="maximizeButton"
        class="window-control window-control-maximize"
        @click="onMaximizeClicked"
      />
      <button
        id="closeButton"
        class="window-control window-control-close"
        @click="onCloseClicked"
      />
    </div>
  </header>

  <!-- -------------------------------- Body -------------------------------- -->
  <slot name="body" />
  <!-- -------------------------------- Modal -------------------------------- -->
  <div ref="exitMinimizeModal" class="modal" v-if="showModal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3>Exit the app?</h3>
      <p>
        Exiting the app will close all the app windows and terminate the app process.<br />
        <br />
        Are you sure?
      </p>
      <span class="buttonBar">
        <button id="minimize" class="modalButton" @click="onModalMinimize">Minimize</button>
        <button id="exit" class="modalButton" @click="exitApp">Exit</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { kWindowNames } from '@/consts'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useBackgroundStore } from '@/stores'

const backgroundStore = useBackgroundStore()

defineProps<{
  windowName: string
}>()

const showModal = ref(false)

const header = useTemplateRef('header')

onMounted(() => {
  if (header.value) setDrag(header.value)
})

function onCloseClicked() {
  showModal.value = true
}

function onMinimizeClicked() {
  backgroundStore.minimizeCurrentWindow()
}

function onMaximizeClicked() {
  backgroundStore.maximimizeCurrentWindow()
}

async function setDrag(elem: HTMLElement) {
  backgroundStore.setCurrentWindowDrag(elem)
}

function onModalMinimize() {
  showModal.value = false
  backgroundStore.minimizeCurrentWindow()
}

function closeModal() {
  showModal.value = false
}

function exitApp() {
  backgroundStore.exitApp()
}
</script>
