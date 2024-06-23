const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');

exports.GitHubStrategyPassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GitHubStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://p2-30789714.onrender.com/auth/github/callback",
        profileFields: ['user:email']
    },
        function (accessToken, refreshToken, profile, cb) {
            // Verifica si el email existe y si no, maneja el error según tu lógica
            if (!profile.emails || !profile.emails.length) {
                return cb(new Error('No email found'), null);
            }

            // Solo pasa el email
            const email = profile.emails[0].value
            return cb(null, { email });
        }
    ));

}


exports.protegercontactos = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect("/login");
    }
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
};

exports.protegerlogin = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return next();
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        return res.redirect('/contactos');
    } catch (error) {
        console.error(error);
        next();
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.EMAIL_LOCKED && password === process.env.PASSWORD_LOCKED) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("jwt", token);
        return res.redirect("/contactos");
    }

    res.status(401).send({
        request: 'Usted no está autorizado o no existe sus credenciales para ingresar a los contactos...'
    });
};


exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
};
