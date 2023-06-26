import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../sequelize.js';
/**
 */
let schema = {
    /**
     * The unique id for the activity
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    /**
     * The name of the notification channel
     */
    channel_name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    }, 

    /**
     * The date/time of the last received message.
     * Used for fast polling for messages in the channel
     */
    last_message_date: DataTypes.DATE

}

/**
 * @type {typeof import('sequelize').Model}
 */
class NotificationChannel extends Model {

}

let sequelize = getSequelize('app');

let model_options = {
    sequelize, // We need to pass the connection instance
    modelName: 'NotificationChannel',
    tableName: 'notification_channel', // We need to choose the model name
    createdAt: 'create_date',
    updatedAt: 'update_date',
    indexes: [
        {fields: ['last_message_date']},
    ]
}

NotificationChannel.init(schema, model_options);
export default NotificationChannel;