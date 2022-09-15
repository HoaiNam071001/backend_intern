const mongoose = require('mongoose');
const User = mongoose.model('User');
const Article = mongoose.model('Article');
const Comment = mongoose.model('Comment');
const Room = mongoose.model('Room');
const Mess = mongoose.model('Message');

const UserfindOne = (query) => User.findOne(query);
const Userfind = (query) => User.find(query);
const UserbyId = (id) => User.findById(id);
const newUser = (username, email, password) => {
    var user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    user.following = [];
    return user.save().then((user) => {
        return { user: user.toAuthJSON() };
    });
};
const getUser = ({ id, email, username }) =>
    Promise.all([UserbyId(id), email ? User.findOne({ email }) : null, username ? UserfindOne({ username }) : null]);

const ArticlefindOne = (query) => Article.findOne(query).populate('author').exec();

const getArticles = (query, limit = 10, offset = 0) =>
    Article.find(query).sort({ createdAt: 'desc' }).limit(Number(limit)).skip(Number(offset)).populate('author');
const countArticle = (query) => Article.count(query);
const getFollow = (query, limit, offset) => Promise.all([getArticles(query, limit, offset), countArticle(query)]);
const getUsername = (author, favorited) =>
    Promise.all([
        author ? UserfindOne({ username: author }) : null,
        favorited ? UserfindOne({ username: favorited }) : null,
    ]);
const getGlobal = (query, id, limit, offset) =>
    Promise.all([getArticles(query, limit, offset), countArticle(query), UserbyId(id)]);
const resultArticles = ({ ...props }) => {
    return {
        articles: props.articles.map((article) => article.toJSONFor(props.user)),
        pagination: {
            currentPage: props.offset / props.limit + 1,
            pageSize: Number(props.limit),
            totalCount: props.totalCount,
            totalPages: Math.ceil(props.totalCount / props.limit),
        },
    };
};
const newArticle = (article, user) => {
    var article = new Article(article);
    article.author = user;
    return article.save().then((article) => {
        return { article: article.toJSONFor(user) };
    });
};
const getArticle = ({ id, slug }) => Promise.all([id ? UserbyId(id) : null, ArticlefindOne({ slug })]);

const deleteComments = (id) => Comment.deleteMany({ article: id });
const getComments = (id) => Comment.find({ article: id }).sort({ createdAt: 'desc' }).populate('author').exec();
const newComment = (body, article, user) => {
    var comment = new Comment(body);
    comment.article = article;
    comment.author = user;
    return comment.save().then(() => {
        return {
            comment: comment.toJSONFor(user),
        };
    });
};
const findComment = (id_cmt, id) => Promise.all([Comment.findById(id_cmt), UserbyId(id)]);

const getRoomsByUser = (userId) =>
    Room.find({
        members: { $in: [userId] },
    })
        .sort({ createdAt: 'desc' })
        .populate('members');
const getMessUser = (id, userId) =>
    Promise.all([
        Room.findOne({ $or: [{ members: [userId, id] }, { members: [id, userId] }] })
            .sort({ createdAt: 'desc' })
            .populate('members'),
        UserbyId(userId),
    ]);
const getMessRoom = (roomId, query, limit) =>
    Promise.all([
        Room.findById(roomId).populate('members'),
        Mess.find(query).sort({ createdAt: 'desc' }).limit(limit).populate('sender'),
        Mess.count(query),
    ]);
const newRoom = (id, userId, user) => {
    const newRoom = new Room({
        members: [id, userId],
    });
    return newRoom.save().then((room) => {
        return {
            room: room.toRoomJSONFor(user),
            messenger: [],
            count: { totalCount: 0, currentCount: 0 },
        };
    });
};
const getMessage = (roomId, limit, where) => {
    const query = { roomId, createdAt: { $lte: where ? where : Date.now() } };
    return Promise.all([
        Mess.find(query).sort({ createdAt: 'desc' }).limit(limit).populate('sender'),
        Mess.count(query),
    ]);
};
const resultMessage = ({ ...props }) => {
    return {
        room: props.room.toRoomJSONFor(props.user),
        messenger: Mess.toJSONFor(props.messages),
        count: { totalCount: props.totalCount, currentCount: props.messages.length },
    };
};

const resultMessage2 = ({ ...props }) => {
    return {
        room: props.room.toRoomJSON(props.id),
        messenger: Mess.toJSONFor(props.messages),
        count: { totalCount: props.totalCount, currentCount: props.messages.length },
    };
};
const newMessage = (message, sender) => {
    const newMessage = new Mess(message);
    return newMessage.save().then((message) => {
        return { message: message.toMessageJSONFor(sender) };
    });
};
const getProfile = (username, id) => Promise.all([UserfindOne({ username }), id ? UserbyId(id) : null]);

const getTag = () =>
    Article.find({})
        .select('tagList')
        .sort({ createdAt: 'desc' })
        .then((res) => {
            const tags = res
                .reduce((prev, cur) => {
                    return [...prev, ...cur.tagList];
                }, [])
                .reduce((acc, curr) => {
                    const tag = curr.toLowerCase();
                    if (!acc[tag]) acc[tag] = 1;
                    else acc[tag] += 1;
                    return acc;
                }, {});
            const result = Object.keys(tags)
                .sort((a, b) => tags[b] - tags[a])
                .slice(0, 10);
            return result;
        });

const Searchs = (input, id) => {
    return Promise.all([
        User.find({
            $or: [{ email: { $regex: input, $options: 'i' } }, { username: { $regex: input, $options: 'i' } }],
        }),
        id ? UserbyId(id) : null,
    ]).then(([users, own]) => {
        return users.map((user) => user.toProfileJSONFor(own));
    });
    // return User.find({ $username_1: { $search: input } });
};

module.exports = {
    getTag,
    Searchs,
    Article: {
        getFollow,
        getUsername,
        getGlobal,
        resultArticles,
        newArticle,
        getArticle,
        ArticlefindOne,
        deleteComments,
    },
    User: {
        UserfindOne,
        Userfind,
        UserbyId,
        newUser,
        getUser,
    },
    Comment: {
        getComments,
        newComment,
        findComment,
    },
    Message: {
        getRoomsByUser,
        getMessUser,
        newRoom,
        getMessage,
        resultMessage,
        getMessRoom,
        resultMessage2,
        newMessage,
    },
    Profile: { getProfile },
};
