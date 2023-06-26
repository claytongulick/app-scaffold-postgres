/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import OTPController from '../controllers/controller-otp.js';
import { wrap } from 'common/server/util.js';

export default function routerOTP(router) {
    /**
     * Log in with a one time password. Expected body param code=asdf12, username=claytongulick, email_address=clay@ratiosoftware.com
     * code and one of username or email_address are required.
     * We use post for this because we don't want OTPs and user identifiers in any logs, even though GET would be the technically correct verb
     */
    router.route('/api/otp/login')
        .post(
            //rate limit to three times per minute
            //RateLimiter.limit(60 * 60 * 1000, 3), 
            wrap(OTPController.login)
        );
    /**
     * Send the OTP to the specified communication type
     */
    router.route('/api/otp/send')
        .post(
            //rate limit to once per 5 minutes
            //RateLimiter.limit(5 * 60 * 60 * 1000, 1), 
            wrap(OTPController.send)
        );
}