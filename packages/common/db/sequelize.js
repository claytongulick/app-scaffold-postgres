import {Sequelize} from 'sequelize';

let instances = {};

let connections = {
    'app': process.env.APP_DB_URI,
    'session': process.env.SESSION_DB_URI
}

/**
 * Async connect method to retrienve and connect to a connection
 * @param {*} connection_name 
 * @returns 
 */
export async function connectSequelize(connection_name) {
    let sequelize;
    let connection_uri = connections[connection_name];
    if(!connection_uri)
        throw new Error('Invalid connection: ' + connection_name);
    if(instances[connection_name])
        sequelize = instances[connection_name];

    if(!sequelize) {
        sequelize = new Sequelize(connection_uri);
        instances[connection_name] = sequelize;
    }
    await sequelize.authenticate();
    return sequelize;
}

/**
 * Syncronous connection fetch, returns the sequelize instance which may not be connected already
 * @param {*} connection_name 
 * @returns 
 */
export function getSequelize(connection_name) {
    let connection_uri = connections[connection_name];
    if(!connection_uri)
        throw new Error('Invalid connection: ' + connection_name);
    if(!(instances[connection_name]))
        instances[connection_name] = new Sequelize(connection_uri);
    /**
     * @type {typeof import('sequelize').Sequelize
     */
    let sequelize = instances[connection_name];
    return sequelize;
}