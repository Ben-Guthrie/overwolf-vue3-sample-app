# Overwolf Vue3 Sample App

This repository contains a version of the [Overwolf sample app](https://github.com/overwolf/sample-app) built in Vue3, taking inspiration from https://github.com/Sorikairox/overwolf-vue-sample. It demonstrates how to configure multiple entry points for the different app windows, preventing the need for multiple separate projects, and uses stores which are shared between the app windows.

For information on the functionality of the app and how to load it in Overwolf, please consult the [Readme for the sample app](https://github.com/overwolf/sample-app) and the [Overwolf documentation](https://dev.overwolf.com/ow-native/getting-started/overview).

## Project Setup

```sh
npm install
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## App Windows

Each window is a separate entry point defined by an html file, `/windows/window_name.html`, loading its corresponding script file from `/src/scripts` which creates and mounts the Vue App.

We instruct vite to build each separate entry point in `vite.config.ts`:

```
  build: {
    rollupOptions: {
      input: {
        background: 'windows/background.html',
        desktop: 'windows/desktop.html',
        inGame: 'windows/in-game.html'
      }
    }
  }
```

And tell Overwolf to consider each as a separate window by adding the paths to the html files in `public/manifest.json`.

## Shared Pinia

In order to share stores between app windows, we expose a shared Pinia on the background window, which the other windows can access with `overwolf.windows.getMainWindow().sharedPinia`. We then call `app.use(sharedPinia)` on the other windows, passing the shared Pinia state.

...which would be great if, it worked. Unfortunately, this doesn't seem to correctly initialize the pinia stores for reasons that I am not smart enough to figure out. To get around this, we must explicitly pass the shared Pinia state the first time we use the store in each window.

For demonstration, in this sample app the 'background' store is used to manage the state of the app windows and respond to game launches. This store is accessible from all app windows and provides functions to minimize, maximize and exit the app.
