/*
 *   Copyright (c) 2020 Ratio Software, LLC 
 *   All rights reserved.
 *   @author Clayton Gulick <clay@ratiosoftware.com>
 */
import UserController from '../controllers/controller-user.js';
import { wrap } from 'common/server/util.js';

export default function routerUser(router) {

    /**
     * This is unauthenticated - we allow user profile without auth
     */
    router.route('/api/users/:user_id/avatar')
        .get(
            wrap(UserController.getAvatar)
        );
        
    /**
     * Return the current authenticated uid
     */
    router.route('/api/whoami')
        .get( 
            UserController.whoAmI 
        );


    router.route('/api/users/:email_address')
        .get(
            wrap(UserController.getBasicUser)
        );
}