const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        // Redirect to an error page or send an error response
        res.redirect('/error');
    }
};

module.exports.update = async function (req, res) {
    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

module.exports.signIn = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

module.exports.create = async function (req, res) {
    if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            await User.create(req.body);
            if(err){req.flash('error', err); return}
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('success', 'You have signed up, login to continue!');
        console.error('Error in signing up:', err);
        return res.redirect('/error');
    }
};

module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
};

module.exports.destroySession = async function (req, res) {
    return new Promise((resolve, reject) => {
        req.logout(err => {
            if (err) {
                console.error('Error logging out:', err);
                reject(err);
            } else {
                resolve();
                req.flash('success', 'You have logged out!');
            }
        });
    })
    .then(() => {
        return res.redirect('/');
    })
    .catch(err => {
        return res.redirect('/error');
    });
};

