/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import {html, render} from 'lit-html';
import ApplicationState from 'applicationstate';
import {Broker} from 'databroker';
import {Router} from '@vaadin/router';
import { navigate } from 'common/ui/utility/lib-router.js';

class SceneHome extends HTMLElement {
    constructor() {
        super();
        this.user = {
            avatar: '',
            first_name: '',
        }
        this.broker = new Broker();
    }


    connectedCallback() {
        this.template = (data) => html`
            <style>
            </style>
            <div>
            This is a fabulous application.
            </div>
        `;

        this.init();
        render(this.template(), this);

    }

    init() {
    }

    render() {
        if(this.template) {
            render(this.template(), this);
        }
    }
}
customElements.define('scene-home', SceneHome);
export default SceneHome;