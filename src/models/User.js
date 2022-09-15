const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            index: true,
        },
        password: String,
        image: String,
        bio: String,
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.setPassword = function (password) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: 36000,
    });
};

UserSchema.methods.toAuthJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image,
    };
};

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        id: this._id,
        username: this.username,
        bio: this.bio,
        image: this.image || null,
        following: user ? user.isFollowing(this._id) : false,
    };
};

UserSchema.methods.toMessJSON = function () {
    return {
        id: this._id,
        username: this.username,
        image: this.image || null,
    };
};

UserSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) this.following.push(id);
    return this.save();
};

UserSchema.methods.unfollow = function (id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function (id) {
    return this.following.some((followId) => followId.toString() === id.toString());
};

mongoose.model('User', UserSchema);
