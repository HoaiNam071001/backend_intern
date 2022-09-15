const { Profile } = require('../services/mongoose');

const Profiles = (() => {
    const getprofile = async (req, res) => {
        try {
            const id = req.payload ? req.payload.id : null,
                username = req.params.username;
            const [profile, user] = await Profile.getProfile(username, id);
            if (!profile) return res.status(404).json({ errors: { profile: ['Invalid'] } });
            return res.json({
                profile: profile.toProfileJSONFor(user),
            });
        } catch (err) {
            res.status(422).json({ errors: { profile: [err] } });
        }
    };
    const followUser = async (req, res) => {
        try {
            const id = req.payload.id,
                username = req.params.username;
            const [profile, user] = await Profile.getProfile(username, id);
            if (!profile) return res.sendStatus(422);
            if (!user) return res.sendStatus(401);
            await user.follow(profile._id);
            return res.json({
                profile: profile.toProfileJSONFor(user),
            });
        } catch (err) {
            res.status(422).json({ errors: { profile: [err] } });
        }
    };
    const unfollowUser = async (req, res) => {
        try {
            const id = req.payload.id,
                username = req.params.username;
            const [profile, user] = await Profile.getProfile(username, id);
            if (!profile) return res.sendStatus(422);
            if (!user) return res.sendStatus(401);
            await user.unfollow(profile._id);
            return res.json({
                profile: profile.toProfileJSONFor(user),
            });
        } catch (err) {
            res.status(422).json({ errors: { profile: [err] } });
        }
    };

    return {
        getprofile,
        followUser,
        unfollowUser,
    };
})();

module.exports = Profiles;
