var express = require('express');
var router = express.Router();

const ContactosController = require('./controllers/models'); 
const ControllerClient = new ContactosController();
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sendform',(req,res) => ControllerClient.save(req,res))






module.exports = router;
