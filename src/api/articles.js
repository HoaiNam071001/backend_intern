const { Article, User } = require('../services/mongoose');

const Articles = (() => {
    const getRecentArticlesFollow = async (req, res, next) => {
        try {
            const { limit = 20, offset = 0 } = req.query;
            const user = await User.UserbyId(req.payload.id);
            if (!user) return res.sendStatus(401);
            const queryArticle = { author: { $in: user.following } };
            const [articles, totalCount] = await Article.getFollow(queryArticle, limit, offset);
            return res.json(Article.resultArticles({ articles, totalCount, user, limit, offset }));
        } catch (error) {
            return res.status(422).json({ errors: { article: [error] } });
        }
    };

    const getRecentArticlesGlobal = async (req, res, next) => {
        try {
            const { limit = 20, offset = 0, favorited = null, tag = null, author = null } = req.query;
            const id = req.payload ? req.payload.id : null;
            var obj = {};
            if (tag) obj.tagList = { $regex: tag, $options: 'i' };

            const [auth, favoriter] = await Article.getUsername(author, favorited);
            if (auth) obj.author = auth._id;
            if (favoriter) obj.favoriteList = { $in: [favoriter._id] };
            else if (req.query.favorited) obj.favoriteList = { $in: [] };
            const [articles, totalCount, user] = await Article.getGlobal(obj, id, limit, offset);
            return res.json(Article.resultArticles({ articles, totalCount, user, limit, offset }));
        } catch (error) {
            return res.status(422).json({ errors: { article: [error] } });
        }
    };

    const createArticle = async (req, res, next) => {
        try {
            const id = req.payload.id;
            if (!req.body.article) throw 'Not body';
            const user = await User.UserbyId(id);
            if (!user) return res.sendStatus(401);
            const article = await Article.newArticle(req.body.article, user);
            return res.json(article);
        } catch (err) {
            return res.status(422).json({ errors: { article: [err] } });
        }
    };
    const getArticle = async (req, res, next) => {
        try {
            const [user, articles] = await Article.getArticle({ id: req.payload?.id, slug: req.params.slug_article });
            if (!articles) return res.sendStatus(404);
            return res.json({
                article: articles.toJSONFor(user),
            });
        } catch (error) {
            return res.status(422).json({ errors: { article: [error] } });
        }
    };
    const updateArticle = async (req, res, next) => {
        try {
            const { title, description, body, tagList, thumbnail } = req.body.article,
                id = req.payload.id;
            const [user, article] = await Article.getArticle({ id: req.payload.id, slug: req.params.slug_article });
            if (!user) return res.sendStatus(401);
            if (!article) return res.sendStatus(404);
            if (article.author._id.toString() !== id.toString()) return res.sendStatus(403);
            if (title !== undefined) article.title = title;
            if (description !== undefined) article.description = description;
            if (body !== undefined) article.body = body;
            if (tagList !== undefined) article.tagList = tagList;
            if (thumbnail !== undefined) article.thumbnail = thumbnail;
            const result = await article.save();
            return res.json({ article: result.toJSONFor(user) });
        } catch (error) {
            return res.status(422).json({ errors: { article: [error] } });
        }
    };
    const deleteArticle = async (req, res) => {
        try {
            const id = req.payload.id;
            const article = await Article.ArticlefindOne({ slug: req.params.slug_article });
            if (!article) return res.sendStatus(404);
            if (article.author._id.toString() === id.toString()) {
                await article.remove();
                await Article.deleteComments(article._id);
                return res.json({});
            } else return res.sendStatus(403);
        } catch (error) {
            return res.status(422).json({ errors: { article: [error] } });
        }
    };
    return {
        getRecentArticlesFollow,
        getRecentArticlesGlobal,
        createArticle,
        getArticle,
        updateArticle,
        deleteArticle,
    };
})();

module.exports = Articles;
