const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');
const validator = require('validator')

var ArticleSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isAlphanumeric(value)){
                throw new Error('id article is invalid')
            }
        }
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    publish_date:{
        type: Date,
        validate(value){
            if(!validator.isDate(value)){
                throw new Error('date is invalid')
            }
        }
       
    },
    summary:{
        type: String,
        required: true,
        trim: true
    },

    writer: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Writer',
        required:true
    },

    reviews:[{
        title:{
            type: String,
            required: true,
            trim: true
        },
        content:{
            type: String,
            required: true,
            trim: true
        },
        likes:{
            type: Number,
            default: 0,
            validate(value){
                if(value<0){
                    throw new Error('likes is invalid')
                }
            }
        },
        dislikes:{
            type: Number,
            default: 0,
            validate(value){
                if(value<0){
                    throw new Error('dislikes is invalid')
                }
            }
        }

    }]

}, { timestamps: true });
ArticleSchema.plugin(id_validator);
ArticleSchema.index("publish_date"); ////checkkkkkkkkk


const Article = mongoose.model('Article', ArticleSchema );

module.exports = Article