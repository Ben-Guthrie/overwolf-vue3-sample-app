<template>
  <AppWindow class="desktopTop" :window-name="kWindowNames.desktop">
    <template #title>
      <h1>Sample App / desktop window</h1>
    </template>
    <template #body>
      <main>
        <div class="desktopTop">
          <h1>Overwolf Sample App</h1>
          <p>
            Welcome to the Overwolf tutorial app for developers.<br />
            Learn how to build an app by using one!
          </p>
          <div id="version"></div>
        </div>
        <div class="desktopBottom">
          <!-- Launch a game! -->
          <div id="left">
            <h1>Launch a game and the In-Game window will pop-up automatically!</h1>
          </div>
          <!-- Launch a game! -->
          <div id="middle">
            What can you learn with this sample app?
            <br /><br />
            1. How to listen to real-time game events and how to identify specific events like match
            start/end, kill, and death.
            <br /><br />
            2. How to use a transparent background window as a service bus, that acts as the main
            controller of your app.
            <br /><br />
            3. How to use Hotkeys that show/hide your app while you are in-game.
          </div>
          <!-- picture -->
          <div id="right">
            <div style="text-align: center">
              <div style="display: inline-block">
                <img src="/public/img/cool_wolf.png" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </template>
  </AppWindow>
</template>

<script setup lang="ts">
import { kWindowNames } from '@/consts'
import AppWindow from '../AppWindow.vue'
</script>
