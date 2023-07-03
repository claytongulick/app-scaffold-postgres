/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import {html, render} from 'lit-html';
import ApplicationState from 'applicationstate';
import {Broker} from 'databroker';
import anime from 'animejs/lib/anime.es.js';
import {Router} from '@vaadin/router';
import { navigate } from 'common/ui/utility/lib-router.js';

class SceneHome extends HTMLElement {
    constructor() {
        super();
        this.user = {
            avatar: '',
            first_name: '',
        }
        ApplicationState.listen('app.login_user', (user) => {
            if(!user) {
                this.user = {avatar:'',first_name:''};
                let pick_login_element = this.querySelector('#pick_login');
                let collect_email_element = this.querySelector("#collect_email");
                collect_email_element.style.display = 'block';
                collect_email_element.style.opacity = '1';
                pick_login_element.style.opacity = '0';
                this.email_address = '';
            }
            this.render();
        })
        this.broker = new Broker();
    }

    get login_method() {
        let remember = ApplicationState.get('app.remember_login_method');
        if(remember)
            return ApplicationState.get('app.preferred_login_method');
        return this._login_method;
    }

    set login_method(value) {
        this._login_method = value;
        let remember = ApplicationState.get('app.remember_login_method');
        if(remember)
            ApplicationState.set('app.preferred_login_method', value);
    }

    connectedCallback() {
        this.template = (data) => html`
            <style>
            </style>
                <div style="position: absolute; top: 0px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    <div id="collect_email" class="shadow rounded" style="padding: 20px; border: 1px solid var(--a-color-lightest-grey);">
                        <h1 style="font-size: 1.8em; color: var(--a-color-dark)">Hi!</h1>
                        <h2 style="font-size: 1.2em; color: var(--a-color-dark)">To sign in, let's start with your email address:</h2>
                        <div>
                            <div>
                                <div class="input-group mb-3">
                                    <div class="form-floating">
                                        <input name="email" class="form-control" type="text" value=${this.email_address} placeholder="Email address" @change=${e => this.email_address = e.target.value}/>
                                        <label for="email">Email address</label>
                                    </div>
                                    <button class="btn btn-primary btn-small" type="button" @click=${e => this.handleEmailNext()}>Next</button>
                                </div>
                            </div>
                            <div class="form-check">
                                <input ?checked=${!!this.email_address} @change=${e => this.handleRememberEmail(e)} class="form-check-input" type="checkbox" value="">
                                <label class="form-check-label" for="flexCheckDefault">
                                    Remember my email 
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pick_login" style="position: absolute; top: 0px; display: none; opacity: 0; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    <div class="shadow rounded" style="padding: 20px; border: 1px solid var(--a-color-lightest-grey);">
                        <h2 style="font-size: 1.2em; color: var(--ion-color-step-700)">Welcome back, ${this.user.first_name}!</h2>
                        <h3 style="font-size: 1em; color: var(--ion-color-step-800)">How would you like to log in?</h3>
                        <div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="login_method" id="login_method_password" @change=${e => this.login_method = 'password'} ?checked=${this.login_method == 'password'}>
                                    <label class="form-check-label" for="login_method_password">
                                        Password
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="login_method" id="login_method_otp_sms"  @change=${e => this.login_method = 'opt-sms'} ?checked=${this.login_method == 'otp-sms'}>
                                    <label class="form-check-label" for="login_method_otp_sms">
                                        A code sent to my phone
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="login_method" id="login_method_otp_email"  @change=${e => this.login_method = 'otp-email'} ?checked=${this.login_method == 'otp-email'}>
                                    <label class="form-check-label" for="login_method_otp_sms">
                                        A code sent to my email
                                    </label>
                                </div>
                        </div>
                        <label style="margin-top: 10px; display: block; color: var(--a-color-danger);">${this.error_message}</label>
                        <button class="btn btn-primary" @click=${e => this.handleSelectLoginMethod(e)}>Next</button>
                        <div class="form-check">
                            <input @change=${e => {
                                let checked = e.target.checked;
                                if(checked)
                                    ApplicationState.set('app.preferred_login_method',this.login_method);
                                else
                                    ApplicationState.set('app.preferred_login_method','');
                                ApplicationState.set('app.remember_login_method', checked);
                            }
                            } class="form-check-input" type="checkbox" ?checked=${ApplicationState.get('app.remember_login_method')}>
                            <label class="form-check-label" for="flexCheckDefault">
                                Remember my choice for next time
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.init();
        render(this.template(), this);

    }

    init() {
        let email_address = ApplicationState.get('app.login_email_address');
        if(email_address)
            this.email_address = email_address;
    }

    render() {
        if(this.template) {
            render(this.template(), this);
        }
    }

    async handleRememberEmail(e) {
        if(e.target.checked)
            ApplicationState.set('app.login_email_address', this.email_address);
        else
            ApplicationState.set('app.login_email_address', '');
    }

    async handleEmailNext() {
        try {
            this.user = await this.broker.get(`/api/users/${encodeURIComponent(this.email_address)}`);
            ApplicationState.set('app.login_user',this.user, {persist: false});
            this.render();
            let preferred_method = ApplicationState.get('app.preferred_login_method');
            if(preferred_method)
                return await this.navigateNextStep(preferred_method);

        }
        catch(err) {
            document.querySelector('app-toaster').toast("Sorry, we can't find that email address. Double check it and try again?")
            return;
        }
        await anime({
            targets: "#collect_email",
            opacity: 0,
            duration: 250
        }).finished;

        document.querySelector('#pick_login').style.display = 'flex';
        await anime({
            targets: "#pick_login",
            opacity: 1,
            duration: 250
        }).finished;
    }

    async handleSelectLoginMethod(e) {
        await this.navigateNextStep(this.login_method);
    }

    async navigateNextStep(preferred_method) {
        switch (preferred_method) {
            case "password":
                ApplicationState.set('app.side_image', 'password');
                navigate('password');
                return;
            case "otp-email":
                await this.sendOTP('email');
                return;
            case "otp-sms":
                await this.sendOTP('sms');
                return;
        }

    }

    async sendOTP(type) {
        this.error_message = '';
        this.render();

        let email_address = this.email_address;

        try {
            let result = await this.broker.post('/api/otp/send', {type, email_address});
            let router = document.querySelector('ion-router');
            await router.push('/otp');
        }
        catch (err) {
            console.error(err);
            let alert_controller = window.alertController;
            let alert;
            alert = await alert_controller.create({
                header: 'Error',
                message: 'Error sending code, try a different method or contact us.',
                buttons: ['OK']
            });

            return await alert.present();
        }
    }

}
customElements.define('scene-home', SceneHome);
export default SceneHome;