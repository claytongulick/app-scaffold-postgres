import { sanitizeUrl } from "@braintree/sanitize-url";

export default class RedirectController {
    /**
     * Safely redirect the user based on a validated redirect_url or a default application based on their role
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async redirect(req, res, next) {
        let user = req.session.user;
        if(!user)
            return res.redirect('/auth');
        if(!req.session.trusted)
            return res.redirect('/auth');

        let redirect_url = req.query.redirect_url;
        if(!redirect_url)
            redirect_url = process.env.DEFAULT_REDIRECT;
        if(!redirect_url)
            return res.status(400).write("Missing redirect");

        //validate the redirect url
        let sanitized = sanitizeUrl(redirect_url);

        function validateBasePath(base_path) {
            let paths = process.env.ALLOWED_REDIRECT_PATHS.split(',').map(path => path.trim());
            return paths.includes(base_path);
        }

        //if this is a full url, parse it and validate
        if(sanitized.startsWith('http')) {
            let url = new URL(sanitized);
            let parts = url.pathname.substring(1).split('/');
            let base_path = parts[0];
            //only redirect to a valid app
            if(!(validateBasePath(base_path)))
                return res.status(403).json({status: 'error', message: 'Invalid redirect url'});

            //on a valid host
            let valid_hostname = [process.env.HOSTNAME, process.env.WHITELABEL_HOSTNAME];
            if(url.hostname)
                if(!(valid_hostname.includes(url.hostname)))
                    return res.status(403).json({status: 'error', message: 'Invalid redirect hostname'});

            let valid_protocols = process.env.ALLOWED_REDIRECT_PROTOCOLS.split(',').map(value => value.trim());
            //make sure it's a secure connection
            if(!valid_protocols.includes(url.protocol.replace(':','')))
                return res.status(403).json({status: 'error', message: 'Invalid protocol'});
        }
        //this is a relative redirect, just check that the path is valid
        else {
            let normalized;
            if(sanitized.startsWith('/'))
                normalized = sanitized.substring(1);
            let parts = normalized.split('/');
            let base_path = parts[0];
            if(!(validateBasePath(base_path)))
                return res.status(403).json({status: 'error', message: 'Invalid redirect url'});
        }

        return res.redirect(sanitized);
    }
}