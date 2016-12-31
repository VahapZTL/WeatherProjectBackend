var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.get = function(req, res) {
    User.findOne({_id: req.decoded}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                data: err
            })
        } else {
            if (user) {
                res.json({
                    success: true,
                    data: user
                })
            } else {
                res.status(404).json({
                    success: false,
                    data: 'User not found'
                })
            }
        }
    })
};

exports.update = function (req, res) {
    User.findOneAndUpdate({_id: req.decoded}, function (err, user) {
        if(err){
            res.status(500).json({
                success: false,
                data: err
            });
        }else{
            if(!user){
                res.status(404).json({
                    success: false,
                    data: 'Böyle bir kullanıcı yok!'
                });
            }else{
                user.email = req.body.email;
                user.pass = req.body.pass;
                user.name = req.body.name;

                user.save(function (err, user) {
                    if(err){
                        res.status(500).json({
                            success: false,
                            data: err
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