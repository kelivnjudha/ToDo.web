const express = require('express');
const router = express.Router();
const UserController = require('../controllers/main');

const userController = new UserController();

router.get('/', (req, res, next) => userController.getLoginPage(req, res, next));
router.get('/404', (req, res, next) => userController.getErrorPage(req, res, next));
router.get('/signup', (req, res, next) => userController.getSignupPage(req, res, next));
router.post('/login', (req, res, next) => userController.checkLoginInfo(req, res, next));
router.post('/createUser', (req, res, next) => userController.signUpCreateUser(req, res, next));
router.post('/logout', (req, res, next) => userController.logout(req, res, next));

// Middleware to handle dynamic routes
router.use((req, res, next) => {
    const activeUrl = req.session.userActiveUrl;
    const accountPathUrl = `${activeUrl}/account`;
    const editAccountPathUrl = `${activeUrl}/account/edit`;
    console.log(`Middleware active URL check: ${req.path} | Session active URLs: ${activeUrl} | ${accountPathUrl}`);
    if (activeUrl && req.path === activeUrl) {
        return userController.getHomePage(req, res, next);
    } else if (req.path === accountPathUrl) {
        return userController.getAccountPage(req, res, next);
    } else if (req.path === editAccountPathUrl) {
        return userController.getEditAccountPage(req, res, next);
    }
    next();
});

// Handle 404 errors
router.use((req, res, next) => userController.getErrorPage(req, res, next));

module.exports = router;
