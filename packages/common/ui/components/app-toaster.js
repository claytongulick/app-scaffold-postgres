import {html, render} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat.js';
import { formatDistanceToNow } from 'date-fns';
import {Toast} from 'bootstrap/dist/js/bootstrap.esm.js';

/**
 * @typedef {object} ToastOptions
 * @property {string} header - Optional header to display
 * @property {string} message - The message to display as the toast body
 * @property {boolean} auto_dismiss - Whether the toast should be automatically dismissed. Defaults to true.
 * @property {number} auto_dismiss_delay - The delay in ms for automatically dismissing the toast. Defaults tp 3000ms / 3s
 * @property {Date} timestamp - Automatically set then the toast() function is called.
 */
class AppToaster extends HTMLElement {

    /** @type {ToastOptions[]} */
    get toasts() {
        return this._toasts || [];
    }

    connectedCallback() {
        this.template = () => html`
        <div class="toast-container position-absolute bottom-0 end-0"
        style="margin-right: 50px; margin-bottom: 30px;"
        >
            ${
                repeat(this.toasts, (toast) => toast.timestamp.getTime(),
                toast => html`
                <div id=${'toast_' + toast.timestamp.getTime()} class="toast" role="alert" >
                    ${toast.header ?
                        html`
                        <div class="toast-header" style="background-color: var(--t-color-primary); color: white;">
                            <strong class="me-auto" color>${toast.header}</strong>
                            <small class="" style="color: white;">${formatDistanceToNow(toast.timestamp)}</small>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        `:''
                    }
                    <div class="toast-body">
                    ${toast.message}
                    </div>
                </div>
                `)
            }

        </div>
        `;
        this.init();
    }

    render() {
        if(!this.template)
            return;

        render(this.template(), this);
    }

    init() {
        //update the time display on the visible toasts
        this._interval_key = setInterval(() => {
            this.render();
        }, 5000);
    }

    /**
     * 
     * @param {string} message 
     * @param {ToastOptions} options 
     */
    toast(message, options) {
        options = Object.assign({
            header: '',
            message,
            auto_dismiss: true,
            auto_dismiss_delay: 3000,
            timestamp: new Date()
        }, options);
        if(!this._toasts)
            this._toasts = [];
        this._toasts.push(options);
        this.render();
        let toast_element = this.querySelector(`#toast_${options.timestamp.getTime()}`);
        toast_element.addEventListener('hidden.bs.toast', () => {
            let index = this._toasts.findIndex(toast => toast.id == toast_element.id);
            this._toasts.splice(index, 1);
            this.render();
        });
        let toast = new Toast(toast_element, {
            autohide: options.auto_dismiss,
            delay: options.auto_dismiss_delay
        });
        toast.show();
    }
}

customElements.define('app-toaster', AppToaster);
export default AppToaster;