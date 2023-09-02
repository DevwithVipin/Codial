const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();
            req.flash('success', 'Comment published!');

            return res.redirect('/');
        }
    } catch (err) {
        // Handle error
        req.flash('error', err);
        return res.redirect('/error'); // You can replace this with an appropriate error handling route
    }
}

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            const postId = comment.post;

            await comment.remove();

            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('/error'); // You can replace this with an appropriate error handling route
    }
}
