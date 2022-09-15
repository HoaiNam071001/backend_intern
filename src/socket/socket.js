const request = require('supertest');
const jwt = require('jsonwebtoken');
const Users = require('./user');

const CreateMessage = ({ server, message, roomId }) => {
    return request(server).post('/api/messenger/create').send({ message, roomId }).expect('Content-Type', /json/);
};

const socket = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        },
    });
    io.use((socket, next) => {
        if (!socket.handshake.auth) return next(new Error('User invalid'));
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return next(new Error('User invalid'));
            socket.userId = decoded._id;
            next();
        });
    });

    io.on('connection', (socket) => {
        Users.addUser({ id: socket.userId, socketId: socket.id, rooms: [] });
        socket.on('join', ({ roomList = [] }, callback) => {
            const online = [];
            const rooms = roomList.map((room) => {
                if (room.id) {
                    socket.join(room.id);
                    socket.to(room.id).emit('status', { id: socket.userId, status: 'online' });
                    if (room.memberId && Users.getUser(room.memberId)) online.push(room.memberId);
                    return room.id;
                }
            });
            Users.addRooms(socket.id, rooms);
            callback(online);
        });
        socket.on('send', ({ message, roomId }, callback) => {
            CreateMessage({ server, message, roomId }).end(function (err, res) {
                if (err) return callback(err);
                socket.to(roomId).emit('receive', res.body, roomId);
                callback(res.body);
            });
        });
        socket.on('call-accept', (roomId) => {
            socket.to(roomId).emit('user-accept');
        });
        socket.on('call-start', (roomId, userId, iscaller) => {
            socket.join(roomId);
            // notify called
            if (iscaller) socket.to(roomId).emit('call-connected', { roomId, userId });
            socket.to(roomId).emit('user-connected', userId);
        });
        socket.on('call-end', (roomId, userId, iscaller = false, callback) => {
            //  caller save to database
            if (iscaller && userId)
                CreateMessage({
                    server,
                    message: { content: ':<<<<<callvideo>>>>>:', createdAt: Date.now(), sender: { id: userId } },
                    roomId,
                }).end(function (err, res) {
                    if (err) return;
                    socket.in(roomId).emit('receive', res.body, roomId);
                    callback({ message: res.body.message, roomId });
                });
            // notify end call in window messenger
            socket.to(roomId).emit('call-disconnected', { roomId, userId });
            // notify end call in window call
            socket.to(roomId).emit('user-disconnected', userId);
        });
        socket.on('disconnect', () => {
            Users.getRooms(socket.id).forEach((room) => {
                socket.to(room).emit('status', { id: socket.userId, status: 'offline' });
            });
            Users.removeUser(socket.id);
        });
    });
};
module.exports = socket;
