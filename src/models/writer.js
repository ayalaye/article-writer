const mongoose = require('mongoose')
const validator = require('validator')

var WriterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    mobile_phone:{
        type: String,
        required: true,
        trim: true,
       
        validate(value) {
            const pattern_mobile_phone = /^05[^7]-[0-9]{7}$/ //  israeli mobile phone
           
            if(!pattern_mobile_phone.test(value)){ // Assuming Israeli mobile phone numbers
                throw new Error('mobile phone is invalid')
            }
        }
    },
    home_phone:{
        type: String,
        trim: true,    
        validate(value) {
            if(value){
                const pattern_home_phone = /^0(2|3|4|8|9|7[0-9])-[0-9]{7}$/; //  israeli home phone
                if(!pattern_home_phone.test(value)){ // Assuming Israeli home phone numbers
                    throw new Error('home phone is invalid')
                }
            }
            
        }
    },
   
}, { timestamps: true }
);

const Writer = mongoose.model('Writer', WriterSchema);

module.exports = Writer