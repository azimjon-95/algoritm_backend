const { Schema, model } = require('mongoose')
const Joi = require('joi')

const adminSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        min: 3
    },
    lastname: {
        type: String,
        required: true,
        min: 3
    },
    age: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        min: 9
    },
    gender: {
        type: String,
        required: true,
        min: 4
    },
    isActive: {
        type: Boolean,
        required: true
    },
    username: {
        type: String,
        required: true,
        min: 4
    },
    password: {
        type: String,
        required: true,
        min: 6
    }
})

const Admins = model('admin', adminSchema)

const validateAdmin = (body) => {
    const schema = Joi.object({
        firstname: Joi.string().required().min(3),
        lastname: Joi.string().required().min(3),
        age: Joi.number().required(),
        gender: Joi.string().required().min(4),
        phoneNumber: Joi.number().required().min(9),
        isActive: Joi.boolean().required(),
        username: Joi.string().required().min(4),
        password: Joi.string().required().min(4),
    })

    return schema.validate(body)
}

module.exports = { Admins, validateAdmin }