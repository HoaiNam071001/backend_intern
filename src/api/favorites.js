const { Article } = require('../services/mongoose');

const Favorites = (() => {
    const favorite = async (req, res) => {
        try {
            const id = req.payload.id,
                slug = req.params.slug_article;
            const [user, article] = await Article.getArticle({ id, slug });
            if (!user) return res.sendStatus(401);
            if (!article) return res.sendStatus(422);
            const result = await article.favorite(id);
            return res.json({ article: result.toJSONFor(user) });
        } catch (err) {
            return res.status(422).json({ errors: { Favorite: [err] } });
        }
    };
    const unfavorite = async (req, res, next) => {
        try {
            const id = req.payload.id,
                slug = req.params.slug_article;
            const [user, article] = await Article.getArticle({ id, slug });
            if (!user) return res.sendStatus(401);
            if (!article) return res.sendStatus(422);
            const result = await article.unfavorite(id);
            return res.json({ article: result.toJSONFor(user) });
        } catch (err) {
            return res.status(422).json({ errors: { Favorite: [err] } });
        }
    };
    return {
        favorite,
        unfavorite,
    };
})();

module.exports = Favorites;
