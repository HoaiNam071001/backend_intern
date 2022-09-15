const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: {
            type: String,
            default: '',
        },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    },
    { timestamps: true }
);

MessageSchema.methods.toMessageJSON = function () {
    return {
        id: this._id,
        sender: this.sender.toMessJSON(),
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
MessageSchema.methods.toMessageJSONFor = function (user) {
    return {
        id: this._id,
        sender: {
            id: user.id,
            username: user.username,
            image: user.image || null,
        },
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
MessageSchema.statics.toJSONFor = function (messages) {
    return messages.map((message) => message.toMessageJSON());
};

mongoose.model('Message', MessageSchema);
