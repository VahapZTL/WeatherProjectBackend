var express = require('express');
var fs = require('fs');

module.exports = function() {

    var controllers = {},
        controllers_path = process.cwd() + '/controller';

    fs.readdirSync(controllers_path).forEach(function(file) {
        if (file.indexOf('.js') != -1) {
            controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
        }
    });

    var router = express.Router();

    router.route('/me')
        .get(controllers.auth.isAuth, controllers.user.get)
        .put(controllers.auth.isAuth, controllers.user.update);

    router.route('/login')
        .post(controllers.auth.login);

    router.route('/register')
        .post(controllers.auth.register);

    return router;
};