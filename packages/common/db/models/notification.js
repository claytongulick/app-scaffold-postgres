import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../sequelize.js';
/**
 * @interface NotificationSchema
 */
let schema = {
    /**
     * The unique id 
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    /**
     * The name of the notification channel. We purposefully don't use the id here in order to 
     * support denormalized queries directly against the notification table and avoiding joins
     */
    notification_channel: {
        type: DataTypes.STRING,
        allowNull: false
    },

    /**
     * The content of the notification
     */
    message: DataTypes.TEXT

}

/**
 * @type {typeof import('sequelize').Model}
 */
class Notification extends Model {

}

let sequelize = getSequelize('app');

let model_options = {
    sequelize, // We need to pass the connection instance
    modelName: 'Notification', // We need to choose the model name
    tableName: 'notification', 
    createdAt: 'create_date',
    updatedAt: 'update_date',
    indexes: [
        {fields: ['notification_channel']}
    ]
}

Notification.init(schema, model_options);
export default Notification;