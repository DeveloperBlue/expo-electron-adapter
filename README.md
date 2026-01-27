# expo-electron-adapter

Expo Electron Adapter serves as a toolkit to add electron support into your expo application. 

Features
- Support for *.electron platform-specific files
- HMR for electron development
- Type-safe ElectronProvider for accessing APIs exposed through preload.ts
- Platform library for checking platform and OS (electron, android, ios, web) (web on windows, macos, linux, android, or ios)
- Optional support for ``electron:*`` platform selectors in Uniwind

TODO
Define minimum expo and electron versions

# Setup

The following steps can be applied to a new expo project or an existing one.

## Installation

> Ensure electron is already installed. If you have not done so already, see their instructions [here](https://www.electronjs.org/docs/latest/tutorial/installation).
 
### Step 1: Install expo-electron-adapter
 ```bash
npm install @developerblue/expo-electron-adapter -D
 ```

### Step 2: Configure Bundler

> If you don’t see a ``metro.config.js`` file in your project, you can create it with ``npx expo customize metro.config.js``.

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withExpoElectronAdapter } = require('expo-electron-adapter/metro')

const config = getDefaultConfig(__dirname);

// your metro modifications

module.exports = withExpoElectronAdapter(config));
```
### Step 3: Add Electron Boilerplate

> If you already have your electron boilerplate setup, you can skip this step.
> 
> **expo-elector-adapter** expects to find certain files in specific places by default, but you can override this behavior at any time.

You can generate a boilerplate with the following command at the root of your project:
```bash
npx expo-electron-adapter generate
```
This will generate an ``electron`` folder at the root of your project, containing a ``main.ts``, ``preload.ts``, ``api/api-interface.ts``, and other necesary files.


### Step 4 Add the ElectronProvider to your App

> This Provider handles injecting the preload script into your application. It also allows you to wrap your electron APIs in a type-safe useElectron() hook.
>
> If you prefer to skip this step, you can import the electron preload script manually yourself and call all your apis through the 'window' global as normal.

Modify your ``app/_layout.tsx`` file to wrap your app with the ``ElectronApiProvider``. 

For every api endpoint you make available in your ``preload`` script using ``exposeInMainWorld()``, you should add that key to the array of keys passed to the ``apis`` prop. If you are using the generated boilerplate, just ``["api"]`` is fine as a default.


If you have a custom preload script in your ``main.ts``, you can pass it in using the ``preloadSrc`` attribute. By default, it uses ``./preload.js``.

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

## Step 4: Uniwind Support (Optional)

If you are using [Uniwind]() to add tailwind CSS to your project, you can easily add support for the ``electron:*`` and ``browser:*`` platform selectors. This allows you to style your components differently when running in Electron or in a browser.

### Usage Example
```tsx
<View className="min-w-8 min-h-8 electron:bg-yellow-600 browser:bg-blue-600 android:bg-green-600 bg-white"/>
```

### Step 1: Add expo-electron-adapter to global.css

Import ``expo-electron-adapter`` in your global.css file, right after ``uniwind``.
```css
/* global.css */
@import "tailwindcss";
@import "uniwind";
@import "expo-electron-adapter";
...
```

### Step 2: Modify +html.tsx

Add the following import to your ``+html.tsx`` file, then add the ``data-platform-electron`` attribute check to the html tag as follows:

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

---


Create electron boilerplate (``expoex init``)
Edit ``+html.tsx`` to add electron support (can be injected via metro?)
Edit metro.config.js
Create typed useElectron hook
Add uniwind support

Run ``expoex doctor`` healthcheck


## Access the Elecron API with a Custom Type-Safe Hook

To access your axposed pis with type-safety, create a custom 'useElectron' hook. You can then pass this hook the shape your API and use it in your components.

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

## Platform
expo-electron-adapter does its best to extend on the react-native Platform library. You can also check if the Platform is specifically running in Electron by using the ``isElectron`` hook.

The "platform" and "os" are distinguished as follows:

``Platform.platform`` returns ``<android, ios, web, electron>``

``Platform.OS`` returns ``<windows, macos, linux, android, ios>``

So you can have a platform of ``"web"`` on an OS of ``"iOS"``. This means the application is running on the browser on iOS, not as a native application.

You have access to the ``Platform.select()`` method to select platform-specific styles or components. If you are using [Uniwind](), it is [recommended that you use className platform selectors]() over using the Platform library.


# Alternative Libraries

Electron is just one way you can run your react-native expo applications on the desktop. You may also want to check out:
- react-native-windows (Windows and MacOS)
- tauri (rust-based light-weight Electron alternative)