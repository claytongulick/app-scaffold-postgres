import RedirectController from '../controllers/controller-redirect.js';
import { wrap } from 'common/server/util.js';

export default function routerRedirect(router) {
    router.route('/api/redirect')
        .get(
            wrap(RedirectController.redirect)
        )
}