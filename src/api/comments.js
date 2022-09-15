const { Article, Comment } = require('../services/mongoose');

const Comments = (() => {
    const getComments = async (req, res, next) => {
        try {
            const id = req.payload ? req.payload.id : null,
                slug = req.params.slug_article;
            const [user, article] = await Article.getArticle({ slug, id });
            if (!article) return res.sendStatus(404);
            const comments = await Comment.getComments(article._id);
            return res.json({
                comments: comments.map((comment) => comment.toJSONFor(user)),
            });
        } catch (err) {
            res.status(422).json({ errors: { Comment: [err] } });
        }
    };
    const createComments = async (req, res, next) => {
        try {
            const id = req.payload.id,
                body = req.body.comment,
                slug = req.params.slug_article;
            if (!body) throw 'Not Body!';
            const [user, article] = await Article.getArticle({ slug, id });
            if (!user) return res.sendStatus(401);
            if (!article) return res.sendStatus(404);
            const cmt = await Comment.newComment(body, article, user);
            return res.json(cmt);
        } catch (err) {
            res.status(422).json({ errors: { Comment: [err] } });
        }
    };

    const deleteComment = async (req, res, next) => {
        try {
            const id = req.payload.id,
                id_comment = req.params.id_comment;

            const [comment, user] = await Comment.findComment(id_comment, id);
            if (!user) return res.sendStatus(401);
            if (!comment) return res.sendStatus(422);
            if (comment.author.toString() !== id) return res.sendStatus(403);
            return comment.remove().then(() => res.status(200).json({}));
        } catch (err) {
            res.status(422).json({ errors: { Comment: [err] } });
        }
    };

    return {
        getComments,
        createComments,
        deleteComment,
    };
})();

module.exports = Comments;
