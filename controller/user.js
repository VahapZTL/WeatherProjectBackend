var mongoose = require('mongoose');
var request = require('request');
var User = mongoose.model('User');

exports.getWeather = function (req, res) {
    User.findOne({_id: req.decoded}, function (err, user) {
        if(err){
            res.json({
                success: false,
                data: err
            });
        }else{
            if(user){
                request('http://api.openweathermap.org/data/2.5/weather?q=Istanbul,tr&APPID=12c721e0096519e62f2ece6aa4341f47',
                        function (error, response, body) {
                    if (error || response.statusCode != 200) {
                        console.log(error);
                        res.json({
                            success: false,
                            data: error
                        });
                    }else {
                        var gelenler = JSON.parse(body);

                        console.log(gelenler);
                        console.log('DB ye Aktarma Başlangıç');

                        user.havaDurumu.coordLon = gelenler['coord'].lon;
                        user.havaDurumu.coordLat = gelenler['coord'].lat;
                        user.havaDurumu.weatherMain = gelenler['weather'].main;
                        user.havaDurumu.mainTemp = gelenler['main'].temp;
                        user.havaDurumu.nameCity = gelenler['name'];
                        user.updateDate = Date.now();

                        console.log('DB ye Aktarma Bitiş');
                        console.log(gelenler['main'].temp);

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
                });
            }else {
                res.json({
                    success: false,
                    data: 'User not found!'
                });
            }
        }
    });
};

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
    });
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