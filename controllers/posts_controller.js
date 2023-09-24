const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if (req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    } catch (err) {
        // Handle errors here
        req.flash('error', err);
        // Redirect to an error page or send an error response
        res.redirect('/error');
    }
};

module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            await post.remove();


            await Comment.deleteMany({ post: req.params.id });
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"post deleted successfully"

                })
            }
            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
        
    } catch (err) {
        req.flash('error', err);
        res.redirect('/error');
    }
};
