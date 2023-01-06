const Joi=require('joi')

const schemas ={
createUser: Joi.object().keys({ 
    username: Joi.string().required() ,
    email: Joi.string().required().email(), 
    password: Joi.string().required(),
    phone: Joi.number().required()
  }),
  userLogin: Joi.object().keys({ 
    email: Joi.string().required().email(), 
    password: Joi.string().required() 
  }),

}; 


  module.exports = schemas;