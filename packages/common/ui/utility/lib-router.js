import { Router } from "@vaadin/router";

let router = null;

/**
 * @param {Element} element an html element, usually the app itself
 * @returns {Router} a vaadin router https://github.com/vaadin/router
 */
function init(element, routes) {
    if (!router) {
        router = new Router(element, {enableNativeViewTransitions: true});
        router.setRoutes(routes);
    }
    return router;
}

/**
 * @returns {Router} a vaadin router https://github.com/vaadin/router
 */
function getRouter() {
    if (!router) throw Error("Router was not initialized");
    return router;
}

function buildURL(path) {
    let base = document.querySelector("base");
    let base_url = new URL(base.href).pathname;
    return `${base_url}${path}`;
}

function navigate(path) {
    Router.go(buildURL(path));
}

export {Router, router, init, getRouter, buildURL, navigate };
