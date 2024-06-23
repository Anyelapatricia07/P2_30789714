var express = require('express');
var router = express.Router();
require('dotenv').config()
const ContactosController = require('./controllers/models');
const ControllerClient = new ContactosController();
const Protect = require('./controllers/protect');
const jwt = require('jsonwebtoken')
const passport = require('passport');
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    KP: process.env.RECAPTCHAPC
  });
});

Protect.GitHubStrategyPassport();

router.post('/sendform', (req, res) => ControllerClient.save(req, res))

router.post('/login', (req, res) => Protect.login(req, res))
router.get('/login', Protect.protegerlogin, (req, res) => {
  res.render('login');
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const email = 'anyelaacosta@gmail.com'
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("jwt", token);
    res.redirect("/contactos");
  });



router.get('/contactos', Protect.protegercontactos,async (req, res) => {
  const email = req.user.email;
  const contactos = await ControllerClient.modelDatabase.obtenerAllContactos();
  res.render('contactos', {
    get: contactos,
    email: email
  })

})


router.get('/logout',(req,res) => {
  Protect.logout(req,res);
})


module.exports = router;
