const User = require('../models/manageData');

class UserController {
    async getHomePage(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = new User(req.session.user.username, req.session.user.passcode);

        try {
            const profileUrl = await user.getUserProfileUrl();
            res.render('home', {
                docTitle: 'Home',
                profileUrl: profileUrl,
                pageHeader: 'ToDo',
                username: user.getUsername(),
            });
        } catch (err) {
            console.error(err);
            res.redirect('/login');
        }
    }

    getErrorPage(req, res, next) {
        res.status(404).render('404', {
            docTitle: 'Page Not Found',
            pageHeader: '404',
            profileUrl: 'https://img.uxcel.com/lessons/11-best-practices-for-designing-404-pages-1705607161016-2x.svg',
            username: '',
        });
    }

    getLoginPage(req, res, next) {
        res.render('login', {
            docTitle: 'Login',
            pageHeader: 'Login',
            profileUrl: '',
            username: '',
            errorMessage: ''
        });
    }

    getSignupPage(req, res, next) {
        res.render('signup', {
            docTitle: 'SignUp',
            pageHeader: 'SignUp',
            profileUrl: '',
            username: '',
            errorMessage: ''
        });
    }

    checkLoginInfo(req, res, next) {
        const inputUsername = req.body.username;
        const inputPassword = req.body.password;
        const user = new User(inputUsername, inputPassword);

        user.login().then(activeUrl => {
            req.session.user = { username: user.username, passcode: user.passcode }; // Store user data in session
            req.session.userActiveUrl = activeUrl; // Store the generated URL in the session
            console.log(`User logged in with active URL: ${activeUrl}`);
            req.session.save(err => {
                if (err) {
                    return next(err);
                }
                res.redirect(activeUrl);
            });
        }).catch(error => {
            console.log(error);
            res.render('login', {
                docTitle: 'Login',
                pageHeader: 'Login',
                profileUrl: '',
                username: '',
                errorMessage: 'Invalid username or password'
            });
        });
    }

    signUpCreateUser(req, res, next) {
        const username = req.body.username;
        const userPassword = req.body.password;
        const userConfirmPassword = req.body.confirm_password;
        if (userPassword !== userConfirmPassword) {
            res.render('signup', {
                docTitle: 'SignUp',
                pageHeader: 'SignUp',
                profileUrl: '',
                username: '',
                errorMessage: 'Passwords do not match'
            });
        } else {
            const user = new User(username, userPassword);
            user.register().then(() => {
                user.createUser().then(() => {
                    user.login().then(activeUrl => {
                        req.session.user = { username: user.username, passcode: user.passcode }; // Store user data in session
                        req.session.userActiveUrl = activeUrl;
                        console.log(`New user created with active URL: ${activeUrl}`);
                        req.session.save(err => {
                            if (err) {
                                return next(err);
                            }
                            res.redirect(activeUrl);
                        });
                    });
                }).catch(err => {
                    console.log(err);
                });
            }).catch(reject => {
                res.render('signup', {
                    docTitle: 'SignUp',
                    pageHeader: 'SignUp',
                    profileUrl: '',
                    username: '',
                    errorMessage: reject
                });
            });
        }
    }

    logout(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = new User(req.session.user.username, req.session.user.passcode);

        user.logout().then(() => {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                }
                res.redirect('/login');
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/login');
        });
    }

    handleDynamicRoute(req, res, next) {
        const activeUrl = req.session.userActiveUrl;
        console.log(`Handling dynamic route: ${req.path} | Expected: ${activeUrl}`);
        if (activeUrl && req.path === activeUrl) {
            this.getHomePage(req, res, next);
        } else {
            next();
        }
    }
}

module.exports = UserController;
