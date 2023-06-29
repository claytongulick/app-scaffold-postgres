import * as Models from 'common/db/models/index.js';

export default async (options, command) => {
    let model_names = Object.keys(Models);
    for(let model_name of model_names) {
        let model = Models[model_name];
        if(options.force)
            await model.sync({force: true});
        else
            await model.sync({alter: true});
    }

}