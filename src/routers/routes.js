
  const express = require('express'),
  articleRoutes = require('./articles');
  
  var router = express.Router();
  
  
  router.post('/articles', articleRoutes.create_article);
  router.post('/articles/:article_id/reviews', articleRoutes.add_review); 
  router.post('/writers', articleRoutes.create_writer); 
  router.get('/articles', articleRoutes.read_articles);
  router.delete('/articles/:article_id/reviews/:review_id', articleRoutes.delete_review); 
  
  
  module.exports = router;
  
  
  
  