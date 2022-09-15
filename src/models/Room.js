const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);
RoomSchema.methods.toRoomJSON = function (id) {
    return {
        id: this._id,
        members: this.members[this.members.findIndex((user) => String(user._id) !== String(id))].toMessJSON(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
RoomSchema.methods.toRoomJSONFor = function (user) {
    return {
        id: this._id,
        members: user.toMessJSON(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
mongoose.model('Room', RoomSchema);
