const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')

const customerRouter = express.Router()

const customerModel = mongoose.model('Customer', new mongoose.Schema({
    isGold : {
        type : Boolean,
        default : false
    },
    name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    },
    phone : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 50
    },
}))

//get all customers
customerRouter.get('/', async (request, response)=> {
    const cutomers = await customerModel.find().sort('name')
    return response.send(cutomers)
})

//get one customer
customerRouter.get('/:id', async (request, response)=> {
    try {
        const customer = await customerModel
        .findById(request.params.id)
        return response.send(customer)
    }
    catch(err){
        return response.status(400).send(err.message)
    }
})

//add a customer
customerRouter.post('/add', async (request, response) => {
    const {error} = validation(request.body)
    if (error) return response.status(400).send(error.details[0].message)
    
    try {
        const customer = new customerModel({
            name : request.body.name,
            phone : request.body.phone,
            isGold : request.body.isGold || false
        })

        await customer.save()

        return response.send(customer)
    }
    catch(err){
        return response.status(400).send(err.message)
    }
})

//edit a customer
customerRouter.put('/:id', async(request, response)=> {
    const {error} = validation(request.body)
    if (error) return response.status(400).send(error.details[0].message)
    
    try {
        const options ={
            name : request.body.name,
            phone : request.body.phone
        }

        const customer = await customerModel
        .findByIdAndUpdate(request.params.id, options, {new : true})

        return response.send(customer)
    }
    catch(err){
        return response.status(400).send(err.message)
    }
})


//delete
customerRouter.delete('/:id', async (request, response)=> {
    try{
        const customerDeleted = await customerModel
            .findByIdAndDelete(request.params.id)
        return response.send(customerDeleted)
    }
    catch(err){
        return response.status(400).send(err.message)
    }
})


//validation
const validation = value =>{
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone : Joi.string().min(3).required()
    })
    return schema.validate(value)
}




module.exports = customerRouter