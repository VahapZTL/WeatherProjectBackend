var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');

var User = mongoose.model('User');

exports.register = function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err){
            res.status(500).json({
                success: false,
                data: err
            });
        }else{
            if(user){
                res.json({
                    success: false,
                    data: 'User already exists!'
                });
            }else{
                var UserModel = new User();

                UserModel.email = req.body.email;
                UserModel.password = req.body.password;
                UserModel.name = req.body.name;

                UserModel.save(function (err, user) {
                    if(err){
                        res.status(500).json({
                            success: false,
                            dara: err
                        });
                    }else{
                        res.json({
                            success: true,
                            data: user
                        });
                    }
                });
            }
        }
    });
};

exports.login = function (req, res) {

    User.findOne({email: req.body.email}, function (err, user) {
        if(err){
            res.status(500).json({
                success: false,
                data: err
            });
        }else{
            if(user){
                user.verifyPassword(req.body.password, function (err, isMatch) {
                    if(err){
                        res.status(500).json({
                            success: false,
                            data: err
                        });
                    }else if(!isMatch){
                        res.json({
                            success: false,
                            data: 'Girdiğiniz bigileri kontrol edin!'
                        });
                    }else if(isMatch){
                        var token = jwt.sign({ _id : user._id }, config.secret);
                        user.token = token;

                        res.json({
                            success: true,
                            data: token
                        });
                    }
                });
            }else{
                res.json({
                    success: false,
                    data: 'Girilen bilgiler yanlış yada böyle bir kullanıcı yok!'
                });
            }
        }
    });
};

exports.isAuth = function (req, res, next) {

    var comingToken = req.headers["authorization"];

    //if(typeof comingToken !== 'undefined')
    if(comingToken){
        var header = comingToken.split(" ");
        var accessToken = header[1];
        jwt.verify(accessToken, config.secret, function (err, decoded) {
            if(err){
                res.json({
                    success: false,
                    data: 'Token bilgisinde hata var!'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.status(403).json({
            success: false,
            data: 'Herhangi bir token bulunamadı!'
        });
    }
};