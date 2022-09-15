const { Message } = require('../services/mongoose');

const Messenger = (() => {
    const getRooms = async (req, res) => {
        try {
            const rooms = await Message.getRoomsByUser(req.payload.id);
            return res.json({ rooms: rooms.map((room) => room.toRoomJSON(req.payload.id)) });
        } catch (err) {
            return res.status(422).json({ errors: { conversation: [err] } });
        }
    };
    const getMessByUser = async (req, res) => {
        try {
            const id = req.payload.id,
                { userId, where, limit = 10 } = req.body;
            if (!userId) throw ' invalid';
            const [room, user] = await Message.getMessUser(id, userId);
            if (!room) {
                const result = await Message.newRoom(id, userId, user);
                return res.json(result);
            } else {
                const [messages, totalCount] = await Message.getMessage(room.id, limit, where);
                if (room.members.findIndex((user) => String(user._id) === String(id)) === -1)
                    return res.status(422).json({ errors: { messenger: ['Unauthentication'] } });
                return res.json(Message.resultMessage({ room, user, messages, totalCount }));
            }
        } catch (err) {
            return res.status(422).json({ errors: { messenger: [err] } });
        }
    };
    const getMessByRoom = async (req, res) => {
        try {
            const id = req.payload.id,
                { roomId, where, limit = 10 } = req.body;
            const query = { roomId, createdAt: { $lte: where ? where : Date.now() } };
            if (!roomId || typeof roomId !== 'string') throw ' invalid';

            const [room, messages, totalCount] = await Message.getMessRoom(roomId, query, limit);
            if (!room) return res.status(422).json({ errors: { messenger: ['room invalid'] } });
            if (room.members.findIndex((user) => String(user._id) === String(id)) === -1)
                return res.status(422).json({ errors: { messenger: ['Unauthentication'] } });
            return res.json(Message.resultMessage2({ room, id, messages, totalCount }));
        } catch (err) {
            return res.status(422).json({ errors: { messenger: [err] } });
        }
    };
    const createMess = async (req, res) => {
        try {
            const message = await Message.newMessage(
                {
                    roomId: req.body.roomId,
                    content: req.body.message.content,
                    createdAt: req.body.message.createdAt,
                    sender: req.body.message.sender.id,
                },
                req.body.message.sender,
            );
            return res.json(message);
        } catch (err) {
            return res.status(422).json({ errors: { messenger: [err] } });
        }
    };
    return {
        getRooms,
        getMessByUser,
        getMessByRoom,
        createMess,
    };
})();

module.exports = Messenger;
