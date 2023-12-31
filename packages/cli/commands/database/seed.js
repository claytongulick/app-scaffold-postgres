import templates from 'common/db/fixtures/communication_templates.js';
import users from 'common/db/fixtures/users.js';
import CommunicationTemplate from 'common/db/models/communication_template.js';
import User from 'common/db/models/user.js';

export default async (options, commander) => {
    for(let user of users) {
        /**
         * @type {typeof import('sequelize').Model}
         */
        let password = user.password;
        delete user['password']
        let new_user = await User.create(user);
        await new_user.setPassword(password);
    }

    for(let template of templates) {
        await CommunicationTemplate.create(template);
    }

}