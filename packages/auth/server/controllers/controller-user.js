import User from 'common/db/models/user.js';

export default class UserController {

    static async getBasicUser(req, res, next) {
        const email_address = req.params.email_address;
        const user = await User.findOne({where: {email_address}, attributes: ['id','avatar','first_name','email_address']});
        if(!user) 
            return res.status(404).json({status: 'error', message: 'user not found'})

        res.json(user);
    }

    static async whoAmI(req, res, next) {
        res.json(req.session.user);
    }
}
