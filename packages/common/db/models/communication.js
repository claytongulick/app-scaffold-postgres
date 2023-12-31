import { DataTypes, Model } from 'sequelize';
import SMS from '../../server/sms.js';
import Email from '../../server/email.js';
import { getSequelize } from '../sequelize.js';

/**
 * @typedef {Object} CommunicationSchema
 * @property {number} id The unique id for the activity
 * @property {string} to The UUID of the user
 * @property {string} type 'sms' or 'email'
 * @property {string} communication_template the template to use, if any
 * @property {string} content the rendered content
 * @property {object} data data to pass to the template
 * @property {string} status the current status
 * @property {Date} status_date the date of the current status
 */
let schema = {
    /**
     * The unique id for the communication
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    /**
     * The user that the communication should be sent to
     */
    to: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    /**
     * The type of communication, 'sms','email'...
     */
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    /**
     * The communication template to use for sending the communication
     */
    communication_template: DataTypes.STRING,

    /**
     * The actual content to send. This can be used instead of a communication template.
     * If a communication template is specified, this will be ignored and overwritten with the rendered template
     */
    content: DataTypes.TEXT,

    /**
     * The object that will be handed to the handlebars communication template for rendering
     */
    data: DataTypes.JSONB,

    /**
     * The status of the communication
     */
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validator: {
            isIn: {
                args: [
                    [
                        'created', //after the communication has been created initially, but before the user has indicated to send it out
                        'pending', //the user has requested the communication be sent, but it is not complete yet
                        'error', //there was a problem sending out at least one of the messages
                        'complete' //all communication has been sent, or failed to send
                    ]
                ],
                msg: 'Must be a valid status'
            }
        },
        defaultValue: 'created',
    },

    status_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}

class CommunicationError extends Error {
    constructor(communication_id, message, err) {
        super();
        this.stack = err?.stack;
        this.name = "CommunicationError";
        this.message = `${message} ${err ? JSON.stringify(err) : ''}`;
        this.reference_id = communication_id;
        this.severity = 3;
    }
}

/**
 * @type {typeof import('sequelize').Model}
 */
class Communication extends Model {
    async send(from_user_id) {
        let User = require('common/db/models/user');
        let CommunicationTemplate = require('common/db/models/communication_template');
        let Activity = require('common/db/models/activity');

        try {
            Activity.log({
                type: 'communication',
                client_id: process.env.CLIENT_ID,
                data: {
                    communication_id: this.id
                },
                user_id: from_user_id,
                phi: false
            });
            let to_user = await User.findOne({ where: { id: this.to }, attributes: ['id', 'first_name', 'last_name', 'email_address', 'phone'] });
            if (!to_user) {
                this.status = 'error';
                this.status_date = new Date();
                await this.save();
                throw new CommunicationError(this.id, "Invalid user")
            }
            if(this.communication_template) {
                let template = await CommunicationTemplate.findOne({ where: { name: this.communication_template } });
                if (!template) {
                    this.status = 'error';
                    this.status_date = new Date();
                    await this.save();
                    throw new CommunicationError(this.id, "Invalid communication template");
                }
                this.content = await template.render(this.data);
            }

            this.status = 'pending';
            this.status_date = new Date();
            await this.save();

            if (this.type == 'sms') {
                if (!to_user.phone) {
                    this.status = 'error';
                    this.status_date = new Date();
                    await this.save();
                    throw new CommunicationError(this.id, "User missing phone number");
                }

                await SMS.sendMessage(to_user.phone, this.content);
                this.status = 'complete';
                this.status_date = new Date();
                await this.save();
                return;
            }

            if(this.type == 'email') {
                await Email.sendEmail(
                    to_user.email_address, 
                    this.data.subject, 
                    this.content,
                    process.env.FROM_EMAIL_ADDRESS,
                    this.data.attachments
                );
                this.status = 'complete';
                this.status_date = new Date();
                await this.save();
                return;
            }
        }
        catch (err) {
            this.status = 'error';
            this.status_date = new Date();
            await this.save();
            throw new CommunicationError(this.id, err.message, err);
        }

    }

}

let sequelize = getSequelize('app');

let model_options = {
    sequelize, // We need to pass the connection instance
    modelName: 'Communication', // We need to choose the model name
    tableName: 'communication',
    createdAt: 'create_date',
    updatedAt: 'update_date',
    indexes: [
        { fields: ['to'] },
        { fields: ['create_date'] }
    ]
}

Communication.init(schema, model_options);
export default Communication;