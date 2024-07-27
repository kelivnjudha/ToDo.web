const User = require('../models/manageData');

class UserController {
    constructor() {
        this.user = null;
        this.userActiveUrl = '';
    }

    setUser(user) {
        this.user = user;
    }

    setUserActiveUrl(url) {
        this.userActiveUrl = url;
    }

    async getHomePage(req, res, next) {
        if (!this.user) {
            return res.redirect('/login');
        }

        try {
            const profileUrl = await this.user.getUserProfileUrl();
            console.log("Profile URL:", profileUrl); // Log the profile URL to verify
            res.render('home', {
                docTitle: 'Home',
                profileUrl: profileUrl,
                pageHeader: 'ToDo',
                username: this.user.getUsername(),
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
            profileUrl: '',
            username: 'Test User',
        });
    }

    getLoginPage(req, res, next) {
        res.render('login', {
            docTitle: 'Login',
            pageHeader: 'Login',
            profileUrl: '',
            username: '',
            errorMessage:''
        });
    }

    getSignupPage(req, res, next) {
        res.render('signup', {
            docTitle:'SignUp',
            pageHeader: 'SignUp',
            profileUrl: '',
            username: '',
            errorMessage:''
        })
    }

    checkLoginInfo(req, res, next) {
        const inputUsername = req.body.username;
        const inputPassword = req.body.password;
        const user = new User(inputUsername, inputPassword);

        user.login().then(resolve => {
            this.setUser(user);
            this.setUserActiveUrl(resolve);  // Store the generated URL
            res.redirect(resolve);
        }).catch(reject => {
            console.log(reject);
            res.render('login', {
                docTitle: 'Login',
                pageHeader: 'Login',
                profileUrl: '',
                username: '',
                errorMessage: 'Invalid username or password'
            })
        });
    }

    signUpCreateUser(req, res, next) {
        const username = req.body.username;
        const userPassword = req.body.password;
        const userConfirmPassword = req.body.confirm_password;
        if(userPassword !== userConfirmPassword){
            res.render('signup', {
                docTitle:'SignUp',
                pageHeader: 'SignUp',
                profileUrl: '',
                username: '',
                errorMessage:'Passwords do not match'
            })
        }else{
            const user = new User(username, userPassword);
            user.register().then(resolve => {
                user.createUser().then(resolve => {
                    user.login().then(resolve => {
                        this.setUser(user);
                        this.setUserActiveUrl(resolve);
                        res.redirect(resolve);
                    })
                }).catch(err => {console.log(err)});
            }).catch(reject => {
                res.render('signup', {
                    docTitle:'SignUp',
                    pageHeader: 'SignUp',
                    profileUrl: '',
                    username: '',
                    errorMessage: reject
                })
            })
        }
    }

    handleDynamicRoute(req, res, next) {
        if (req.path === this.getUserActiveUrl()) {
            this.getHomePage(req, res, next);
        } else {
            this.getErrorPage(req, res, next);
        }
    }

    getUserActiveUrl() {
        return this.userActiveUrl;
    }
}

module.exports = UserController;
