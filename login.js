const express = require('express');
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import the Google OAuth strategy

const loginRouter = express.Router();

// Create a MySQL connection pool
const users = mysql.createPool({
    host: 'localhost',
    user: 'your-mysql-username',
    password: 'your-mysql-password',
    database: 'users',
});

const hashPassword = async (password, saltRounds) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.log(err);
    }
    return null;
}

const comparePasswords = async (password, hash) => {
    try {
        const matchFound = await bcrypt.compare(password, hash);
        return matchFound;
    } catch (err) {
        console.log(err);
    }
    return false;
};

const createUser = async (user, password) => {
    const passwordHash = await hashPassword(password, 12);
    const newUser = {
        id: crypto.randomUUID(),
        password: passwordHash,
        ...user
    };
    return newUser;
}

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


//// INITIALIZE PASSPORT ////
loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    // Look up user id in database.
    users.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) { return done(err); }
        done(null, rows[0]);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
    users.query('SELECT * FROM users WHERE googleId = ?', [profile.id], (err, rows) => {
        if (err) { return done(err); }
        if (rows.length > 0) {
          return done(null, rows[0]);
        }
        return done(null, false);
    });
}));

// Configure Passport for Google OAuth authentication
passport.use(new GoogleStrategy({
    clientID: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    callbackURL: 'http://localhost:3000/auth/google/callback', // Your callback URL
}, (accessToken, refreshToken, profile, done) => { // Check if the user already exists in your database
    users.query('SELECT * FROM users WHERE googleId = ?', [profile.id], (err, rows) => {
        if (err) { return done(err); }
        if (rows.length > 0) {
            return done(null, rows[0]);
        }

        // if the user doesn't exist, create a new one
        const newUser = {
            googleId: profile.id,
            username: profile.displayName,
        };
    
        users.query('INSERT INTO users SET ?', newUser, (err, result) => {
            if (err) { return done(err); }
            newUser.id = result.insertId;
            done(null, newUser);
        });
    });
}));


//// NORMAL ROUTES ////

loginRouter.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");

});

loginRouter.get('/profile', isAuthenticated, (req, res) => {
    res.send(`Hello, ${
        req.user.username
    }! <a href="/logout">Logout</a>`);
});

// local login route
loginRouter.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const newUser = await createUser({
        username
    }, password);
    if (newUser) {
        res.status(201).json({msg: "New user created!", newUser});
    } else {
        res.status(500).json({msg: "Unable to create user"});
    }
});


//// AUTH ROUTES ////

// local login route
loginRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));

// Google OAuth login route
loginRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

// Google OAuth callback route
loginRouter.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));


module.exports = loginRouter;