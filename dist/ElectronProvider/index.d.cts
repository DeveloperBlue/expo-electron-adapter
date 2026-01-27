import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

declare const isElectron: boolean;

declare function ElectronApiProvider({ apis, children }: {
    apis: string[];
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useElectronProvider<T>(): T;
type TypedUseElectronHook<T> = () => T;

export { ElectronApiProvider, type TypedUseElectronHook, isElectron, useElectronProvider };
