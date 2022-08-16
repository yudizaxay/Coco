const multer = require("multer");
const fs = require("fs");
var cloudinary = require("cloudinary").v2;
require("dotenv").config();
const url = require("url");
const { Event } = require("../../../models");
const controllers = {};

//multer setup
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.cwd() + "/cover-pic");
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + "_" + file.originalname);
    },
});
let fileFilter = function (req, file, cb) {
    var allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            {
                success: false,
                message:
                    "Invalid file type. Only JPG, JPEG & PNG image files are allowed.",
            },
            false
        );
    }
};

let oMulterObj = {
    storage: storage,
    limits: {
        fileSize: 8 * 1024 * 1024, // 8mb
    },
    fileFilter: fileFilter,
};
const upload = multer(oMulterObj).single("file");

//register events
controllers.registerEvent = async (req, res) => {
    try {
        await upload(req, res, async (error) => {
            if (error) return res.reply(messages.bad_request(error.message));
            if (!req.body.sWalletAddress)
                return res.reply(messages.not_found("Wallet"));
            if (!req.body.sTransactionHash)
                return res.reply(messages.not_found("Hash"));
            if (!req.body.sEventName)
                return res.reply(messages.not_found("Event Name"));
            if (!req.body.sEventDescription)
                return res.reply(messages.not_found("Description"));
            if (!req.body.nTicket)
                return res.reply(messages.not_found("Tickets"));
            if (!req.body.nPrice) return res.reply(messages.not_found("Price"));

            if (req.file != undefined) {
                const aAllowedMimes = ["image/jpeg", "image/jpg", "image/png"];
                log.green(req.file.mimetype);
                if (!aAllowedMimes.includes(req.file.mimetype)) {
                    return res.reply(messages.invalid("File Type"));
                }
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET,
                    secure: true,
                });

                cloudinary.uploader.upload(
                    req.file.path,
                    {
                        folder: `${process.env.CLOUDINARY_FOLDER_NAME}/profile`,
                        unique_filename: true,
                    },
                    function (error, result) {
                        if (error) {
                            console.log("error=", error);
                            return res.reply(messages.server_error());
                        }

                        fs.unlinkSync(req.file.path);

                        let register = new Event({
                            sWalletAddress: req.body.sWalletAddress,
                            sTransactionHash: req.body.sTransactionHash,
                            sEventName: req.body.sEventName,
                            sEventDescription: req.body.sEventDescription,
                            nTicket: req.body.nTicket,
                            nPrice: req.body.nPrice,
                            sProfilePicUrl: result.url,
                        })
                            .save()
                            .then(async (result) => {
                                return res.reply(messages.success(), {
                                    success: true,
                                });
                            })
                            .catch((err) => {
                                console.log("Mongo err==", err);
                                return res.reply(messages.server_error());
                            });
                    }
                );
            } else {
                return res.reply(messages.not_found("File"));
            }
        });
    } catch (error) {
        console.log("error = ", error);
        return res.reply(messages.server_error());
    }
};

//fetch all nfts
controllers.fetchNFTS = async (req, res) => {
    try {
        let allNFTS = await Event.find({});
        if (allNFTS.length > 0 || allNFTS) {
            return res.reply(messages.success(), {
                data: allNFTS,
            });
        }
        return res.reply(messages.not_found("Event"));
    } catch (error) {
        console.log("error = ", error);
        return res.reply(messages.server_error());
    }
};

//fetch token
controllers.fetchToken = async (req, res) => {
    try {
        console.log("body = ", req.params.sHash);
        let allNFTS = await Event.find({ sTransactionHash: req.params.sHash });
        if (allNFTS.length > 0 || allNFTS !== {}) {
            return res.reply(messages.success(), {
                data: allNFTS[0].aToken,
                price: allNFTS[0].nPrice,
                owner: allNFTS[0].sWalletAddress,
                sHash: allNFTS[0].sTransactionHash,
            });
        }
        return res.reply(messages.not_found("Event"));
    } catch (error) {
        console.log("error = ", error);
        return res.reply(messages.server_error());
    }
};

//update token
controllers.updateToken = async (req, res) => {
    try {
        console.log("body = ", req.params);
        let updatetoken = await Event.findOneAndUpdate(
            { sTransactionHash: req.params.sHash },
            { $pull: { aToken: Number(req.params.nToken) } },
            { returnOriginal: true }
        );
        if (updatetoken.length > 0 || updatetoken !== {}) {
            return res.reply(messages.success());
        } else {
            return res.reply(messages.not_found("Event"));
        }
    } catch (error) {
        console.log("error = ", error);
        return res.reply(messages.server_error());
    }
};

module.exports = controllers;
