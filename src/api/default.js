const { getTag, Searchs } = require('../services/mongoose');
const Default = (() => {
    const getTags = async (req, res) => {
        try {
            const tags = await getTag();
            res.json({ tags });
        } catch (err) {
            res.status(422).json({
                errors: {
                    tags: [err],
                },
            });
        }
    };
    const Search = async (req, res) => {
        const keyword = req.query.keyword,
            id = req.payload ? req.payload.id : null;
        const result = await Searchs(keyword, id);
        res.json(result);
    };
    return {
        getTags,
        Search,
    };
})();

module.exports = Default;
