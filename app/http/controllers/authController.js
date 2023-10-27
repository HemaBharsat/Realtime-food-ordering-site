const passport = require('passport');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

function authController() {
    // Factory functions
    return {
        // CRUD 
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res, next) {
            const { email, password } = req.body
            // Validate the request
            if (!email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/login');
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')

                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register');
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;

            try {
                // Validate the request
                if (!name || !email || !password) {
                    req.flash('error', 'All fields are required');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Check if email exists
                const emailExists = await User.exists({ email: email });
                if (emailExists) {
                    req.flash('error', 'Email already registered');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a User
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });

                await user.save();
                // Login
                return res.redirect('/');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController
