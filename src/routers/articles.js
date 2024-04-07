
var validator = require('validator');
const { JSDOM } = require('jsdom');
const Article = require('../models/article');
const Writer = require('../models/writer');
const { window } = new JSDOM('');
const $ = require('jquery')(window);
const uuid = require('uuid');

  
  module.exports = {
    //READ
    
    //This function displays the list of articles and all the details related to them, 
    //including details of the author and details of reviews.
    read_articles: function (req, res) {
        Article.find().populate('writer').then(articles => res.send(articles)
        ).catch (e=> res.status(500).send())
    },
  
  
    
    // CREATE

    // This function receives the details of the article: 
    //article ID (can be a combination of letters and numbers), title of the article, 
    //publication date of the article, summary of the article, the reporter who wrote the article.
    //All fields are mandatory. The function will return an appropriate status in case of success or failure.
    create_article: async function (req, res) {

            if(!req.body || !req.body.id ||!req.body.title||!req.body.summary||!req.body.publish_date||!req.body.writer){
                return res.status(400).send('one or more fields not complete');  
            }

            const expectedFields = ['id','title', 'summary', 'publish_date', 'writer'];
            // Iterate over the properties of req.body to check if there is unexpected field
            for (const field in req.body) {
                if (!expectedFields.includes(field)) {
                    console.warn(`Unexpected field received: ${field}`);
                    return res.status(400).send(`Unexpected field received: ${field}`);
                }
            }
            let existingArticle, existingWriter;
            try {
                // check if article exists

                existingArticle = await Article.findOne({ id: req.body.id });
                if (existingArticle) {
                    return res.status(400).send({ error: 'Article with this id already exists' });
                }
            
                // check if writer exists
                existingWriter = await Writer.findById(req.body.writer);
                if (!existingWriter) {
                    return res.status(404).send({ error: 'Writer not found' });
                }
            
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: 'Internal server error' });
            }
            
            // check validation
            if(!validator.isAlphanumeric(req.body.id)||!validator.isDate(req.body.publish_date)){
                return res.status(400).send('one or more fields not valid');
            }
            

            // add the new article

            const article = new Article(req.body);
            article.reviews = []; 

            await article.save().then(article=>
                res.status(201).send(article)
            ).catch(e=>res.status(400).send(e))

        
    },


    //This function receives the reporter's details: the reporter's name, the reporter's email address, mobile number, home number (if any).
    //The function will return an appropriate status in case of success or failure.
    create_writer: async function (req,res){
        const expectedFieldsInWriter = ['name', 'email', 'mobile_phone','home_phone']
        // Iterate over the properties of req.body.writer to check if there is unexpected field
        for (const field in req.body) {
            if (!expectedFieldsInWriter.includes(field)) {
                console.warn(`Unexpected field received: ${field}`);
                return res.status(400).send(`Unexpected field received: ${field}`);
            }
        }
        const pattern_home_phone = /^0(2|3|4|8|9|7[0-9])-[0-9]{7}$/; //  israeli home phone
        const pattern_mobile_phone = /^05[^7]-[0-9]{7}$/ //  israeli mobile phone
        if(req.body.home_phone && !pattern_home_phone.test(req.body.home_phone)){ // Assuming Israeli home phone numbers
            return res.status(400).send('home phone not valid');
        }
         
        tempName = req.body.name.replace(/\s/g, '');

        // check validation
        if(!validator.isAlpha(tempName)|| !pattern_mobile_phone.test(req.body.mobile_phone)){
            return res.status(400).send('one or more fields not valid');
        }
        if(!validator.isEmail(req.body.email)){
            return res.status(400).send('email not valid'); 
        }
        let existingWriterByEmail;
        let existingWriterByPhone;
        try {
            // check if email exists
            existingWriterByEmail = await Writer.findOne({ email: req.body.email });
            if (existingWriterByEmail) {
                return res.status(400).send({ error: 'Writer with this email already exists' });
            }

            // check if mobile_phone exists
            existingWriterByPhone = await Writer.findOne({ mobile_phone: req.body.mobile_phone });
            if (existingWriterByPhone) {
                return res.status(400).send({ error: 'Writer with this mobile phone already exists' });
            }
        
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal server error' });
        }
        

        // add the new writer

        const writer = new Writer(req.body);

        await writer.save().then(writer=>
            res.status(201).send(writer)
        ).catch(e=>res.status(400).send(e))



    },


    //The following information is sent to each review: title, content, number of likes and number of dislikes. 
    //The function will return a message if Article_id does not exist or in other cases where the input does not match.
    add_review: async function (req, res) {
        
            const article_id = req.params["article_id"];
            let existingArticle;
            if (!article_id) {
                return res.status(400).send("articleId not exists");
            } 
            try {
                // check if article exists

                existingArticle = await Article.findOne({ id: article_id });
                if (!existingArticle) {
                    return res.status(400).send({ error: 'Article not found' });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send({ error: 'Internal server error' });
            }
            
            
            if(!req.body || !req.body.title || !req.body.content ){
               return res.status(400).send("one or more of the fields not complete");
            }

            
            const expectedFields = ['title', 'content', 'likes', 'dislikes'];

            // Iterate over the properties of req.body to check if there is unexpected field
            for (const field in req.body) {
                if (!expectedFields.includes(field)) {
                    console.warn(`Unexpected field received: ${field}`);
                    return res.status(400).send(`Unexpected field received: ${field}`);
                }
            }
    
            existingArticle.reviews.push(req.body);

            // Save the updated article with the new review
            await existingArticle.save();
    
            res.status(201).send({ message: 'Review added successfully', article: existingArticle }); 
    },

  
    //DELETE

    //This function will delete the review from the review list of the given article, 
    //the function will return a message if Article_id does not exist or in other cases where the input does not match.
    delete_review: async function (req, res) {

        const review_id = req.params["review_id"];
        const article_id = req.params["article_id"];
        if (!article_id ){
            return res.status(404).send("articleId not exists"); 
        } 
        let existingArticle;
        try {
            // check if article exists
            existingArticle = await Article.findOne({ id: article_id });
            if (!existingArticle) {
                return res.status(400).send({ error: 'Article not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal server error' });
        }
        
        if(!review_id ){
            return res.status(404).send("review_id not valid"); 
        }
        
        // Check if the reviews array contains a review with the specified review_id
        const reviewIndex = existingArticle.reviews.findIndex(review => String(review._id) === review_id);


        // If the review does not exist, return an error
        if (reviewIndex === -1) {
            return res.status(404).send({ error: 'Review not found' });
        }

        // Remove the review from the reviews array
        existingArticle.reviews.splice(reviewIndex, 1);

        // Save the updated article without the deleted review
        await existingArticle.save();

        res.status(200).send({ message: 'Review deleted successfully', article: existingArticle });
    
    }
  };
  
  
  
  
  
  
  
  
  