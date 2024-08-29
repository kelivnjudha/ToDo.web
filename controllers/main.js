const User = require('../models/manageData');

class UserController {
    async getHomePage(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = new User(req.session.user.username, req.session.user.passcode);

        try {
            const profileUrl = await user.getUserProfileUrl();
            const access = await user.access();
            const theme = await user.theme();
            res.render('home', {
                docTitle: 'Home',
                profileUrl: profileUrl,
                pageHeader: 'ToDo',
                username: user.getUsername(),
                activeUrl: req.session.userActiveUrl,
                access: access,
                theme: theme,
            });
        } catch (err) {
            console.error(err);
            res.redirect('/login');
        }
    }

    async getErrorPage(req, res, next) {
        const flag = false;
        if(flag){
            const user = new User(req.session.user.username, req.session.user.passcode);
            try{
                const profileUrl = 'https://img.uxcel.com/lessons/11-best-practices-for-designing-404-pages-1705607161016-2x.svg';
                const access = await user.access();
                const theme = await user.theme();
    
                res.status(404).render('404',{
                    docTitle: 'Page Not Found',
                    profileUrl: profileUrl,
                    pageHeader: '404',
                    username: user.getUsername(),
                    activeUrl: req.session.userActiveUrl,
                    access: access,
                    theme: theme,
                });
            }catch (error){
                console.log('Unexpected Error occoured.')
            }
        }else{
            res.status(404).render('404', {
                docTitle: 'Page Not Found',
                profileUrl: 'https://img.uxcel.com/lessons/11-best-practices-for-designing-404-pages-1705607161016-2x.svg',
                pageHeader: '404',
                username: 'Page Not Found',
                activeUrl: '',
                access: false,
                theme: '',
            })
        }
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

    async getEditAccountPage(req, res, next){
        if(!req.session.user) {
            return res.redirect('/login');
        }

        const user = new User(req.session.user.username, req.session.user.passcode);

        try {
            const profileUrl = await user.getUserProfileUrl();
            const access = await user.access();
            const theme = await user.theme();
            res.render('editAccount', {
                docTitle: 'Edit',
                profileUrl: profileUrl,
                pageHeader: 'Account',
                username: user.getUsername(),
                activeUrl: req.session.userActiveUrl,
                access: access,
                theme: theme,
            });
        } catch (err) {
            console.error(err);
            res.redirect('/login');
        }
    }

    async getAccountPage(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = new User(req.session.user.username, req.session.user.passcode);

        try {
            const profileUrl = await user.getUserProfileUrl();
            const access = await user.access();
            const theme = await user.theme();
            res.render('account', {
                docTitle: 'Account',
                profileUrl: profileUrl,
                pageHeader: 'Account',
                username: user.getUsername(),
                activeUrl: req.session.userActiveUrl,
                access: access,
                theme: theme,
            });
        } catch (err) {
            console.error(err);
            res.redirect('/login');
        }
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
                res.redirect('/');
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/');
        });
    }

    handleDynamicRoute(req, res, next) {
        const activeUrl = req.session.userActiveUrl;
        const accountUrl = `${activeUrl}/account`;
        console.log(`Active URL Paths:  
        -${accountUrl} 
        -${accountUrl}`);
        console.log(`Handling dynamic route: ${req.path} | Expected: ${activeUrl}`);
        if (activeUrl && req.path === activeUrl) {
            this.getHomePage(req, res, next);
        } else if(activeUrl && req.path === `${activeUrl}/account`) {
            this.getAccountPage(req, res, next);
        } else if(activeUrl && req.path === `${accountUrl}/account/edit`){

        } else {
            next();
        }
    }
}

module.exports = UserController;
