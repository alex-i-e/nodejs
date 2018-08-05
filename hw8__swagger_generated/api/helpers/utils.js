import mongoose from 'mongoose';

export function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function preSaveLastModifiedDate(next) {
    if (!this.lastModifiedDate) this.lastModifiedDate = new Date;
    next();
}

export async function processQuery(action, res) {
    try {
        const result = await action;

        res.json({
            status: "OK",
            result
        });
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}

export async function deleteItem({schemeName, modelName = '', id, fieldName, res}) {
    try {
        const model = await mongoose.model(
            modelName || schemeName,
            require(`../models/${schemeName}`)
        );
        const instance = await model.findOne({[fieldName]: id}); // findOneAndDelete

        if (instance) {
            instance.remove();
            processQuery(Promise.resolve('DELETED'), res)
        } else {
            res.json({
                status: "INFO",
                result: `${(modelName || schemeName).toUpperCase()} DOES NOT EXIST`
            });
        }
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}

export async function getAll({schemeName, modelName, res}) {
    try {
        const model = await mongoose.model(
            modelName || schemeName,
            require(`../models/${schemeName}`)
        );

        await processQuery(model.find({}), res);
    } catch (err) {
        res.json({
            status: "ERROR",
            code: err.statusCode,
            result: err.stack
        });
    }
}