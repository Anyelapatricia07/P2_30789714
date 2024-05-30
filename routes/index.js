var express = require('express');
var router = express.Router();
require('dotenv').config()
const ContactosController = require('./controllers/models'); 
const ControllerClient = new ContactosController();
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    KP: process.env.RECAPTCHAPC
   });
});

router.post('/sendform',(req,res) => ControllerClient.save(req,res))






module.exports = router;
