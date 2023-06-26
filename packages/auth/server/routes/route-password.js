import ControllerPassword from '../controllers/controller-password.js';
import { wrap } from 'common/server/util.js';

export default function routerPassword(router) {
    /**
     * Log in with normal username and password. This returns a JWT.
     */
    router.route('/api/password').post( wrap(ControllerPassword.loginWithPassword) );

}