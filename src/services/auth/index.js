const mongoose = require("mongoose");
const Model = mongoose.model("User");
const passport = require("passport")
const dotenv = require("dotenv")
const { generateToken } = require("../../helpers/jwt");

const { validate, setReturnObject } = require("../../helpers/response");
const strategy = require("passport-facebook")

const FacebookStrategy = strategy.Strategy;

dotenv.config();
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name'] //This
        },
        async function (accessToken, refreshToken, profile, done) {
            const { email, first_name, last_name } = profile._json;
            const userData = {
                username: email,
                name: `${first_name} ${last_name}`,
                type: "facebook"
            };
            var user = await Model.findOneAndUpdate({ username: email }, userData, { upsert: true });
            done(null, user);
        }
    )
);

const sendUser = async (req, res) => {
    try {
        let result = await validate(
            req.user,
            'user',
            process.env.CODE_DELETED,
            process.env.MESSAGE_DELETED
        );
        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}

const login = async (req, res) => {
    const resultQuery = await Model.findOne({
        username: req.body.username
    });
    try {
        await validate(resultQuery, 'user', process.env.CODE_FOUND);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
    const isPasswordMatch = resultQuery.password === req.body.password;
    if (!isPasswordMatch) {
        let error = await setReturnObject(
            null,
            'user',
            null,
            "Wrong password",
            400
        );
        res.status(400).json(error);
    }
    if (resultQuery.status === true) {
        const token = await generateToken(resultQuery);
        resultQuery.auth.token = token;
        await resultQuery.save();
        res.json(await validate(resultQuery, 'user', process.env.CODE_FOUND));
    } else {
        let error = await setReturnObject(
            null,
            'user',
            null,
            "Your user is inactive",
            400
        );
        res.status(400).json(error);
    }
}

module.exports = {
    sendUser: sendUser,
    login: login
}