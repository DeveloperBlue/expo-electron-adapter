# expo-electron-adapter
![npm](https://img.shields.io/npm/v/@developerblue/expo-electron-adapter)
![license](https://img.shields.io/npm/l/@developerblue/expo-electron-adapter)
![platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS-blue)
![expo](https://img.shields.io/badge/Expo-compatible-000020?logo=expo)
![electron](https://img.shields.io/badge/Electron-powered-47848F?logo=electron)
![CI](https://github.com/developerblue/expo-electron-adapter/actions/workflows/ci.yml/badge.svg)
![downloads](https://img.shields.io/npm/dw/@developerblue/expo-electron-adapter)

# v0.0.1-alpha

Build cross-platform applications for Windows, macOS, Linux, Android, and iOS using Expo and Electron.

> [!CAUTION]
>  You are currently viewing a (working) proof-of-concept! This is a very new, very experimental project and should be used with caution!
> 
> See [Contributing & Roadmap](#contributing-&-roadmap) for missing and planned features.

## Features

- ⚡ Integration between **Expo** and **Electron**
- 🧩 Single codebase for **desktop (Electron)**, **web**, and **mobile (Expo)**
- 🧠 Fully typed Electron API access via React Context
- 🛠️ Automatic Electron boilerplate and project scaffolding
- 🎨 Built-in **Uniwind** support with `electron:*` and `browser:*` selectors
- 🏗️ electron-builder support (coming soon) 🚧
- 🗂️ Platform-specific file resolution (`*.electron.*`, `*.browser.*`)


# Setup

> [!NOTE]  
> This tool expects that you already have some understanding of [expo](https://docs.expo.dev/) and [electron](https://www.electronjs.org/docs/latest).

## Installation

> Ensure **Electron** is already installed. If you have not done so already, see their instructions [here](https://www.npmjs.com/package/electron).
 
### Step 1: Install expo-electron-adapter
 ```bash
npm install https://github.com/developerblue/expo-electron-adapter -D
 ```

### Step 2: Configure Bundler

> If you don’t see a ``metro.config.js`` file in your project, you can create it with ``npx expo customize metro.config.js``.

Wrap your metro config with ``useExpoElectronAdapter``. If you have any other metro config modifiers, feel free to add them after the adapter.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withExpoElectronAdapter } = require('/expo-electron-adapter/metro')

const config = getDefaultConfig(__dirname);

/* your metro modifications */

module.exports = withExpoElectronAdapter(config);
```
### Step 3: Add Electron Boilerplate

> If you already have your own existing electron boilerplate setup, you can skip this step.

You can generate an electron boilerplate with the following command **at the root of your project:**
```bash
npx expo-electron-adapter generate
```
This will generate an ``electron`` folder at the root of your project, containing ``main.ts``, ``preload.ts``, ``api/api-interface.ts``, and other required files.


### Step 4: Add the ElectronProvider to your App

> This provider handles injecting the ``preload`` script into your application. It also allows you to wrap any of your exposed electron APIs in a type-safe useElectron() hook.
>
> If you prefer to skip this step, you can import the electron preload script manually yourself and call all your APIs through the 'window' global as normal.

Modify your ``app/_layout.tsx`` file to wrap your app with the ``ElectronApiProvider``. 

```tsx
// _layout.tsx
import { ElectronApiProvider } from 'expo-electron-adapter/ElectronProvider';

.
.
.

export default function RootLayout() {
  return (
    <ElectronApiProvider apis={["api"]}>
      { /* Your app contents */ }
    </ElectronApiProvider>
  );
}

```
For every [api endpoint](https://www.electronjs.org/docs/latest/api/context-bridge) you make available in your ``preload`` script using ``exposeInMainWorld()``, you should add that key to the array of keys passed to the ``apis`` prop. If you are using the generated boilerplate, just ``["api"]`` is fine as a default.

If you have a custom preload script in your ``main.ts``, you can pass it in using the ``preloadSrc`` attribute. By default, it uses ``./preload.js``.

## Step 5: Uniwind Support (Optional)

If you are using [Uniwind]() to add tailwind CSS to your react-native project, you can add support for the ``electron:*`` and ``browser:*`` platform selectors. This allows you to style your components differently whether they are rendering in Electron or in a browser.

**Example**
```tsx
<View className="min-w-8 min-h-8 electron:bg-yellow-600 browser:bg-blue-600 android:bg-green-600 bg-white"/>
```

### Step 5.1: Add expo-electron-adapter to global.css

Import ``expo-electron-adapter`` in your global.css file, right after ``uniwind``.
```css
/* global.css */
@import "tailwindcss";
@import "uniwind";
@import "expo-electron-adapter";
...
```

### Step 5.2: Modify +html.tsx

Add the following import for ``isExpoElectronRuntime`` to your ``+html.tsx`` file; then add the ``data-platform-electron`` attribute check to the ``html`` tag as follows:

```tsx
import { isExpoElectronRuntime } from 'expo-electron-adapter/metro';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-background" data-platform-electron={isExpoElectronRuntime}>
      <head>
        ...
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

> Also remember to ensure your ``metro.config.js`` is correctly configured to include the expo-electron-adapter and Uniwind plugin.

## Step 6: Run

Add the following command to your ``package.json`` script:
```json
"electron" : "npx expo-electron-adapter start"
```

Then run it to start an electron-specific expo web server
```bash
npm run electron
```

# Bundling for electron-builder

> [!CAUTION]
> This section is a work-in-progress

To package your application for distribution with electron-builder, you must transpile the main and preload scripts from typescript to javascript.

This tool uses ``tsup``  for bundling the main and preload scripts, and uses expo's ``export`` command to export the react-native part of the application.

```bash
expo-electron-adapter bundle # generates electron and expo js bundles
```

The generated bundle for packaging with electron-builder can be found at ``.electron/build/bundle``

> [!NOTE]
> The expo ``export`` command's static files can be found in ``.electron/build/static``. In teh fututure. This is referenced by the electron application in ``.electron/build/bundle`` as the starting point for the renderer.
> 
> In the future, these will be reduced down to one single bundle and more control will be given to the user to control the build process.

## Access the Electron API with a Custom Type-Safe Hook

To access your exposed pis with type-safety, create a custom 'useElectron' hook. You can then pass this hook the shape your API and use it in your components.

```tsx
// user-created @/hooks/useElectron.tsx
import type { ElectronApis } from "@/electron/api/api-interface";
import { useElectronProvider, type TypedUseElectronHook } from "expo-electron-adapter/ElectronProvider";

export const useElectron: TypedUseElectronHook<ElectronApis> = useElectronProvider;
```

#### Usage Example
```tsx
import useElectron from "@/hooks/useElectron";

export default function Component() {

  const { api } = useElectron()

  return (
    <Pressable onPress={() => api.someApiMethod()}>
  )

}

```

# Contributing & Roadmap
- [ ] [electron-builder](https://www.electron.build/index.html) steps
- [ ] Build a Platform library similar to react-native's [Platform](https://reactnative.dev/docs/platform) library. [\[Read More\]](./docs/Platform.md)
- [ ] Convert uniwind installation to a codemod. e.g. ``npx expo-electron-adapter add-uniwind``.
- [ ] CI/CD Testing suite with jest
- [ ] Monorepo with example projects
- [ ] Issue templates
- [ ] Proper documentation docs

# Alternative Libraries

Electron is just one way you can run your react-native expo applications on the desktop. You may also want to check out:
- [react-native-windows](https://github.com/microsoft/react-native-windows) (Windows and macOS)
- [proton-native](https://proton-native.js.org/#/) (Cross-platform desktop app framework that exports to Qt)

- [tauri](https://v2.tauri.app/) (rust-based light-weight Electron alternative)