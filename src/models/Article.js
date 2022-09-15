const mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const ArticleSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: String,
        description: String,
        body: String,
        thumbnail: String,
        tagList: {
            type: Array,
            default: [],
        },
        favoriteList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        slug: {
            type: String,
            slug: 'title',
            unique: true,
        },
    },
    { timestamps: true },
);

ArticleSchema.methods.toJSONFor = function (user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        thumbnail: this.thumbnail,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? this.isFavorite(user._id) : false,
        favoritesCount: this.favoriteList.length,
        author: this.author.toProfileJSONFor(user),
    };
};

ArticleSchema.methods.favorite = function (id) {
    if (this.favoriteList.indexOf(id) === -1) this.favoriteList.push(id);
    return this.save();
};

ArticleSchema.methods.unfavorite = function (id) {
    this.favoriteList.remove(id);
    return this.save();
};

ArticleSchema.methods.isFavorite = function (id) {
    return this.favoriteList.some((userId) => userId.toString() === id.toString());
};

mongoose.model('Article', ArticleSchema);
