/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import Controller2FA from '../controllers/controller-2fa.js';
import { wrap } from 'common/server/util.js';
export default function router2fa(router) {

    router.route('/api/2fa/password')
        .post(
            wrap(Controller2FA.authPassword)
        );

    router.route('/api/2fa/otp')
        .post(
            wrap(Controller2FA.authOTP)
        );
}