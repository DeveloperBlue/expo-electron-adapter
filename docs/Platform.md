# Platform
expo-electron-adapter does its best to extend on the react-native Platform library. You can also check if the Platform is specifically running in Electron by using the ``isElectron`` hook.

The "platform" and "os" are distinguished as follows:

``Platform.platform`` returns ``<android, ios, web, electron>``

``Platform.OS`` returns ``<windows, macos, linux, android, ios>``

So you can have a platform of ``"web"`` on an OS of ``"iOS"``. This means the application is running on the browser on iOS, not as a native application.

You have access to the ``Platform.select()`` method to select platform-specific styles or components. If you are using [Uniwind](), it is [recommended that you use className platform selectors]() over using the Platform library.