import {html, render} from 'lit-html';
import ApplicationState from 'applicationstate';
import {Broker} from 'databroker';
import { navigate, router } from 'common/ui/utility/lib-router.js';

class ScenePassword extends HTMLElement {
    constructor() {
        super();
        this.broker = new Broker();
        this.user = ApplicationState.get('app.login_user');
        ApplicationState.listen('app.login_user', (user) => {
            this.user = user;
            this.render();
        })
    }
    connectedCallback() {
        this.template = (data) => html`
            <style>
            </style>
            <div style="position: absolute; top: 0px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <div id="collect_email" class="shadow rounded" style="padding: 20px; border: 1px solid var(--a-color-lightest-grey);">
                    <h2 style="font-size: 1.2em; color: var(--ion-color-step-700)">To log in as ${this.user.email_address} just enter your password below.</h2>
                    <div class="input-group mb-3">
                        <div class="form-floating">
                            <input type="password" 
                                class="form-control" 
                                id="login_password" 
                                placeholder="Password"
                                @keydown=${e => {
                                    if(e.keyCode == 13) {
                                        this.handleLogin();
                                    }
                                }}
                            >
                            <label for="password">Password</label>
                        </div>
                        <button class="btn btn-primary btn-small" type="button" @click=${e => this.handleLogin()} >Log In</button>
                    </div>
                    <div @click=${e => this.handleDifferentLogin()}
                        style="cursor: pointer; color: var(--ion-color-secondary); font-size: 12px; margin-top: 10px; font-style: underline;">
                        I'd like to log in a different way
                    </div>
                    <div @click=${e => this.handleDifferentUser()}
                        style="cursor: pointer; color: var(--ion-color-secondary); font-size: 12px; margin-top: 10px; font-style: underline;">
                        I'm not ${this.user.email_address}
                    </div>
                </div>
            </div>
        `;

        this.init();
        this.render();
    }

    async init() {
        if(this.user)
            return;
        
        navigate('');

    }

    render() {
        if(this.template && this.user)
            render(this.template(), this);
    }

    async handleLogin() {
        let username = ApplicationState.get('app.login_email_address');
        let password = this.querySelector('#login_password').value;
        if(!username)
            navigate('');
        if(!password) {
            let toaster = document.querySelector('app-toaster');
            toaster.toast('Please enter a password to log in')
        }

        try {
            await this.broker.post(`/api/password`, { username, password });
            let redirect_url = ApplicationState.get('app.redirect_url');
            router.unsubscribe();
            if(redirect_url)
                window.location.href = '/auth/api/redirect?redirect_url=' + redirect_url;
            else
                window.location.href = '/auth/api/redirect';
        }
        catch(err) {
            let toaster = document.querySelector('app-toaster');
            if(err.code == '403') {
                return toaster.toast("There was an error logging you in, please check your password and try again.")
            }
            else {
                return toaster.toast("There was an internal error when trying to log you in. Please try a different login method. If this problem persists, please contact support.")
            }
        }
    }

    async handleDifferentLogin() {
        ApplicationState.set('app.preferred_login_method','');
        ApplicationState.set('app.side_image','');
        navigate('');

    }

    async handleDifferentUser() {
        ApplicationState.set('app.preferred_login_method','');
        ApplicationState.set('app.login_user','');
        ApplicationState.set('app.login_email_address','');
        ApplicationState.set('app.side_image','');

        navigate('');
    }

}
customElements.define('scene-password', ScenePassword);
export default ScenePassword;