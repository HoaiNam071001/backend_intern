const router = require('express').Router();
const articles = require('../api/articles');
const comments = require('../api/comments');
const favorites = require('../api/favorites');
const { VerifyToken, CheckToken } = require('../middleware/Token');

router.get('/feed', VerifyToken, articles.getRecentArticlesFollow);
router.get('/', CheckToken, articles.getRecentArticlesGlobal);
router.post('/', VerifyToken, articles.createArticle);
router.get('/:slug_article', CheckToken, articles.getArticle);
router.put('/:slug_article', VerifyToken, articles.updateArticle);
router.delete('/:slug_article', VerifyToken, articles.deleteArticle);

router.get('/:slug_article/comments', CheckToken, comments.getComments);
router.post('/:slug_article/comments', VerifyToken, comments.createComments);
router.delete('/:slug_article/comments/:id_comment', VerifyToken, comments.deleteComment);

router.post('/:slug_article/favorite', VerifyToken, favorites.favorite);
router.delete('/:slug_article/favorite', VerifyToken, favorites.unfavorite);

module.exports = router;
