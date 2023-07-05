/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import {html, render} from 'lit-html';

import {Broker} from 'databroker';

import AppToaster from 'common/ui/components/app-toaster.js';

import SceneHome from '../scene/scene-home';
import ApplicationState from 'applicationstate';
import {init, Router} from 'common/ui/utility/lib-router.js';

const ROUTES = [
    {
        path: '/redirect(.*)',
        action: async (ctx, commands) => {
            debugger;
            Router.setTriggers([{activate: () => {}}])
            
            window.location.pathname = ctx.pathname;
        }
    },
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
        //verify the user is logged in. If not, redirect to the auth app
        let user = await this.broker.get(`/../auth/api/whoami`);
        if(!user)
            return window.location.href = '/auth?redirect_url=' + window.location.href;
        ApplicationState.set('app.user', user);
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
            init(outlet, ROUTES);
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

customElements.define("app-main", ComponentMain);
export default ComponentMain;