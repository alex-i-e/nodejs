// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));


/*app.use(require('express-session')({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });*/

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         User.findOne({username: username}, function (err, user) {
//             if (err) {
//                 return done(err);
//             }
//             if (!user) {
//                 return done(null, false);
//             }
//             if (!user.verifyPassword(password)) {
//                 return done(null, false);
//             }
//             return done(null, user);
//         });
//     }
// ));