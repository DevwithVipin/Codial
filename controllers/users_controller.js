const User = require('../models/user'); // Adjust the path as needed

module.exports.profile = function(req, res) {
    return res.render('user_profile', {
        title: 'User Profile'
    });
};

module.exports.signUp = function(req, res) {
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

module.exports.signIn = function(req, res) {
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

module.exports.create = async function(req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error:', err);
        return res.redirect('back');
    }
};

module.exports.createSession = function(req, res) {
    return res.redirect('/');
};

module.exports.destroySession = function(req, res) {
    req.logout(() => {
        // This callback function is executed after the user is logged out
        // Redirect or perform any other actions after logout
        return res.redirect('/'); // Redirect to the homepage or another page
    });
};
