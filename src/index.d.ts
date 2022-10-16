import { createComponentStyle } from "@riadh-adrani/recursive-web";
import { FreeStyleSheet } from "@riadh-adrani/recursive-web/lib";
import { createElement, createRoute } from "@riadh-adrani/recursive-web/use";
import { RecursiveElement, StateArray } from "@riadh-adrani/recursive/lib";

export { createElement, createComponentStyle, createRoute };

/**
 * Calculate the parameters of the current path and returns them as a key-value object.
 * @throws an error when the router is not initialized.
 */
export function getParams(): Record<string, string>;

/**
 * Change the current route and trigger an update if needed.
 * @throws an error when the router is not initialized.
 * @param {string} path Destination path.
 */
export function goTo(path: string): void;

/**
 * Used to inject a route component into the elements tree.
 *
 * Could be used recursively within nested routes to render the appropriate components.
 *
 * @throws an error when the router is not initialized.
 * @returns The current route fragment element.
 */
export function renderRoute(): RecursiveElement;

/**
 * Retrieve the current route as string.
 * @throws an error when the router is not initialized.
 *
 * @returns {string} Route path.
 */
export function getRoute(): string;

/**
 * return the currently targeted anchor.
 *
 * @throws an error when the router is not initialized.
 */
export function getAnchor(): string;

/**
 * Return the base of the application.
 * @throws an error when the router is not initialized.
 * @returns {string} Base as string.
 */
export function getBase(): string;

/**
 * Retrieve an existing stateful object from the `state` store if it exists.
 * @param {string} key identifier
 * @throw an error if the state does not exist.
 * @returns {StateArray} state as an array.
 */
export function getState<T = any>(key: T): StateArray<T>;

/**
 * Create and save a stateful object in the `state` store within the global `StateStore`.
 *
 * Objects created by this method are deleted when they are not used or called in a rendering iteration.
 * @param {string} key unique identifier of the state within its store.
 * @param {any} value initial value
 * @param {Function} onInit a function that will execute when the state is initialized.
 * If the return value of this function is a function itself,
 * it will be executed whe the state is destroyed.
 * @param {Function} onRemoved a function that will execute when the state has been destroyed.
 * @returns {StateArray} state as an Array
 */
export function setState<T>(
    key: string,
    value: T,
    onInit: () => Function,
    onRemoved: () => void
): StateArray<T>;

/**
 * Retrieve an existing stateful object from the `cache` store if it exists.
 * @param {string} key identifier
 * @throw an error if the state does not exist.
 * @returns {StateArray} state as an array.
 */
export function getCache<T = any>(key: string): StateArray<T>;

/**
 * Create and save a stateful object in the `cache` store within the global `StateStore`.
 *
 * Objects created by this method are not deleted when they are not used,
 * unless the number of cached object exceed the maximum allocated size which is by default `1000`.
 *
 * Older states will be deleted first.
 *
 * @param {string} key unique identifier of the state within its store.
 * @param {any} value initial value
 * @param {Function} onInit a function that will execute when the state is initialized.
 * If the return value of this function is a function itself,
 * it will be executed whe the state is destroyed.
 * @param {Function} onRemoved a function that will execute when the state has been destroyed.
 * @returns {StateArray} state as an array.
 */
export function setCache<T>(
    key: string,
    value: T,
    onInit: () => Function,
    onRemoved: () => void
): StateArray<T>;

/**
 * Retrieve an existing element from the `reference` store, or the default value.
 *
 * Use the `hooks.onRef` hook and return a string from the function to initialize a new reference:
 *
 * ```js
 * createElement("div",{
 *      hooks:{
 *          // onRef is executed every time the App updates.
 *          onRef:() => "my-ref";
 *      }
 *  });
 *
 * // use this function later like this :
 *
 * const ref = getRef("my-ref");
 *
 * ```
 * @param {string} key identifier
 * @returns {any} Native Element
 */
export function getRef<T = HTMLElement>(key: string, defaultValue: T): T;

/**
 * Execute an effect.
 * @param {string} key identifier.
 * @param {Function} callback callback to be executed.
 * @param {Array} dependencies effect dependencies that will decide if the effect should be called again.
 */
export function setEffect(key: string, dependencies: Array<any>, callback: () => Function): void;

/**
 * Batch update made within the callback.
 *
 * Used generally to state update after an asynchronous call.
 *
 * ### ``The callback function should not be an asynchronous function.``
 *
 * ```js
 * // ✅ Correct use
 * const data = await getData();
 * updateOn(() => {
 *      setState1(data.value1);
 *      setState2(data.value2);
 * })
 *
 * // ❌ Bad use
 * // can cause unexpected behavior
 * updateOn(async () => {
 *      const data = await getData();
 *
 *      setState1(data.value1);
 *      setState2(data.value2);
 *
 * })
 * ```
 *
 * @param {Function} callback callback that will be executed.
 */
export function updateOn(callback: () => void): void;

/**
 * Add a style sheet that will be evaluated every time the app rerender.
 *
 * Can be used multiple times, at any depth within the tree of components.
 *
 * @param styleSheet style sheet declaration.
 */
export function setStyle(styleSheet: FreeStyleSheet): void;
