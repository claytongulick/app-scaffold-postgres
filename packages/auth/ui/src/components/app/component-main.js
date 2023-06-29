/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import {html, render} from 'lit-html';

import {Broker} from 'databroker';

import {Router} from '@vaadin/router';
import AppToaster from 'common/ui/components/app-toaster.js';

import SceneHome from '../scene/scene-home';
import ScenePassword from '../scene/flows/password/scene-password';
import SceneLoginOTP from '../scene/flows/otp/scene-login-otp';
import ApplicationState from 'applicationstate';

const ROUTES = [
    { path: "/", component: "scene-home" },
    { path: "/password", component: "scene-password" },
    { path: "/otp", component: "scene-login-otp" },
];

/**
 * This is the main application class
 */
class ComponentMain extends HTMLElement {

    constructor() {
        super();
        this.broker = new Broker();

        /*
        this.version = APP_VERSION;
        this.environment = NODE_ENV;
        this.app_name = APP_NAME;
        */
        console.log(`Starting ${this.app_name} v${this.version} in ${this.environment} environment.`)

        this.notifications = [];

        let handleError = async (message) => {
        }

        //global error handler
        window.addEventListener('error',async (e) => {await handleError(e.message) });
        window.onunhandledrejection = async (e) => {await handleError(e.reason) };

    }

    connectedCallback() {
        this.template = () => html`
        <main
            id="main-view"
            style="
            flex-grow: 1; 
            display: flex; 
            flex-direction: column;
            width: 100%;
        ">
            <article
                class="container-fluid"
                id="main-router-outlet"
                style="height: calc(100vh - 95px); padding: 0;"></article>
        </main>
        <app-toaster></app-toaster>
        `;

        this.render();
        this.init();
    }

    render() {
        render(this.template({}), this);
    }

    async init() {
        this.initRouter();
        this.broker.addEventListener('loading', this.handleLoading.bind(this));
        this.broker.addEventListener('loading_complete', this.handleLoadingComplete.bind(this));
        this.loading_controller = window.loadingController;
        let url = new URL(window.location);
        let redirect_url = url.searchParams.get('redirect_url');
        if(redirect_url)
            ApplicationState.set('app.redirect_url', redirect_url, {persist: false});
        else
            ApplicationState.set('app.redirect_url','');

    }

    initRouter() {
        if (this._router_initialized) return;
        requestAnimationFrame(() => {
            let outlet = this.querySelector('#main-router-outlet');
            let router = new Router(outlet, {enableNativeViewTransitions: true});
            this.router = router;
            router.setRoutes(ROUTES);
            this._router_initialized = true;
            document.getElementById("main-view").addEventListener("click", () => {
                this.handleMainViewClick();
            });
        });
    }

    async handleLoading() {
    }

    handleLoadingComplete() {
    }

    handleRouteChange(e) {

    }

    handleMainViewClick() {

    }
}

customElements.define("component-main", ComponentMain);
export default ComponentMain;