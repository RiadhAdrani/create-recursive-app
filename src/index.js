import { RecursiveWebApp, createComponentStyle } from "@riadh-adrani/recursive-web/index";
import { createElement, createRoute } from "@riadh-adrani/recursive-web/use";
import app from "./app/App";

const webApp = new RecursiveWebApp({ root: document.body, app });

export { createComponentStyle, createElement, createRoute };

export const getParams = () => webApp.getParams();

export const goTo = (path) => webApp.goTo(path);

export const renderRoute = () => webApp.renderRoute();

export const getRoute = () => webApp.getRoute();

export const getAnchor = () => webApp.getAnchor();

export const getBase = () => webApp.getBase();

export const getState = (key) => webApp.getState(key);

export const getCache = (key) => webApp.getCache(key);

export const setState = (key, value, onInit, onRemoved) =>
    webApp.setState(key, value, onInit, onRemoved);

export const setCache = (key, value, onInit, onRemoved) =>
    webApp.setCache(key, value, onInit, onRemoved);

export const getRef = (key, defaultValue) => webApp.getRef(key, defaultValue);

export const setEffect = (key, dependencies, callback) =>
    webApp.setEffect(key, dependencies, callback);

export const updateOn = (callback) => webApp.updateOn(callback);

export const setStyle = (style) => webApp.setStyle(style);

webApp.render();
