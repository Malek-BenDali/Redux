const express = require('express')
const {genresModel, validation} = require('../models/genres')
const genresRouter = express.Router()

//all genres
genresRouter.get('/', async(request, response)=>{
    try {const genres = await genresModel
        .find()
        .sort('name')
    return response.send(genres)
    }
    catch(err){
        return response.send(err.message)
    }
})

//add genre
genresRouter.post(`/add`, async (request, response)=>{
    const {error} = validation(request.body)
    if (error) return response.status(400).send(error.details[0].message)

    try {
        const genre = new genresModel({
            name : request.body.name
        })
    
        await genre.save()
        return response.send(genre)
    }
    catch(err){
        return response.send(err.message)
    }
})


//etid genre
genresRouter.put(`/:id`, async (request, response)=> {

    const {error} = validation(request.body)
    if (error) return response.status(400).send(error.details[0].message)
    try{
        const genre = await genresModel
        .findByIdAndUpdate(request.params.id, {name : request.body.name}, {new : true})
        return response.send(genre)
    }
    catch(err){
        return response.status(404).send(err.message)
    } 
    
})


//delete genre
genresRouter.delete(`/:id`, async (request, response)=> {

    try{
        const genre = await genresModel
        .findByIdAndRemove(request.params.id)
        return response.send(genre)
    }
    catch(err){
        return response.status(404).send(err.message)
    } 
    
})

//details
genresRouter.get('/:id', async (request, response)=> {
    try{
        const genre = await genresModel.findById(request.params.id)
        if (!genre) return response.status(404).send('Id not found')
        return response.send(genre)
    }
    catch(err){
        return response.send(err.message)
    }

})


module.exports = genresRouter