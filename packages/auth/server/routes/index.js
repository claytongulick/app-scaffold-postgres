import express from 'express';
import router2fa from './route-2fa.js';
import routerOTP from './route-otp.js';
import routerPassword from './route-password.js';
import routerRedirect from './route-redirect.js';
import routerUser from './route-user.js';

const routes = [
    router2fa,
    routerOTP,
    routerPassword,
    routerRedirect,
    routerUser
];

let router = express.Router();
router.__mount_path = '/auth'
for(let route of routes) {
    route(router);
}

export default router;
