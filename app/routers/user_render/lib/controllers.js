const controllers = {};

controllers.landing = (req, res) => {
    return res.render("user/index");
};
controllers.allEvents = (req, res) => {
    return res.render("user/events");
};
controllers.nfts = (req, res) => {
    return res.render("user/nfts");
};

module.exports = controllers;
