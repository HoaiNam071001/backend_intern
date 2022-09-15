const { User } = require('../services/mongoose');

const user = (() => {
    const login = async (req, res) => {
        try {
            const { email, password } = req.body.user;
            if (!email) throw { email: "can't be blank" };
            if (!password) throw { password: "can't be blank" };
            const user = await User.UserfindOne({ email });
            if (!user) return res.status(422).json({ errors: { Email: ["doesn't exist"] } });
            const valid = await user.validPassword(password);
            if (!valid) return res.status(422).json({ errors: { Password: ['is wrong'] } });
            return res.json({ user: user.toAuthJSON() });
        } catch (err) {
            res.status(422).json({ errors: err });
        }
    };
    const register = async (req, res) => {
        try {
            const { username, email, password } = req.body.user;
            if (!username) throw { username: "can't be blank" };
            if (!email) throw { email: "can't be blank" };
            if (!password) throw { password: "can't be blank" };

            const users = await User.Userfind({ $or: [{ username }, { email }] });
            if (users.length === 0) return User.newUser(username, email, password).then((user) => res.json(user));
            var err = {
                username: users.some((idx) => idx.username === username) ? ['has already been taken'] : undefined,
                email: users.some((idx) => idx.email === email) ? ['has already been taken'] : undefined,
            };
            return res.status(422).json({ errors: err });
        } catch (err) {
            res.status(422).json({ errors: err });
        }
    };
    const getCurrentUser = async (req, res) => {
        try {
            const user = await User.UserbyId(req.payload.id);
            if (!user) return res.sendStatus(401);
            return res.json({ user: user.toAuthJSON() });
        } catch (err) {
            res.status(422).json({ errors: err });
        }
    };
    const updateCurrentUser = async (req, res, next) => {
        try {
            const { username, email, bio, image, password, oldpassword } = req.body.user,
                id = req.payload.id;
            const [user, existsEmail, existsUname] = await User.getUser({ id, email, username });
            if (!user) return res.sendStatus(401);
            var check = { errors: {} };
            if (existsUname && String(existsUname._id) !== String(user._id))
                check.errors.username = [' has already been taken'];
            if (existsEmail && String(existsEmail._id) !== String(user._id))
                check.errors.email = [' has already been taken'];

            if (Object.keys(check.errors).length !== 0) return res.status(422).json(check);

            if (username !== undefined) user.username = username;
            if (email !== undefined) user.email = email;
            if (bio !== undefined) user.bio = bio;
            if (image !== undefined) user.image = image;
            if (password !== undefined) {
                if (!oldpassword) res.status(422).json({ errors: { 'Old password': ["can't be blank"] } });
                const valid = await user.validPassword(oldpassword);
                if (!valid) return res.status(422).json({ errors: { 'Old password': ['is wrong'] } });
                user.setPassword(password);
                await user.save();
                return res.json({ user: user.toAuthJSON() });
            }

            await user.save();
            return res.json({ user: user.toAuthJSON() });
        } catch (err) {
            res.status(422).json({ errors: err });
        }
    };

    return {
        getCurrentUser,
        updateCurrentUser,
        login,
        register,
    };
})();

module.exports = user;
