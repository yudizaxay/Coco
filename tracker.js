const Web3 = require("web3");
const ethers = require("ethers");
const mongoose = require("mongoose");
require("dotenv").config();

const { Event } = require("./app/models");

var web3 = new Web3(process.env.NETWORK_RPC_URL);

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose
    .connect(process.env.DB_URL, options)
    .then(() => {
        console.log("=> Database connected");
    })
    .catch((error) => {
        console.log("=> error in db connection!");
        console.log(error);
        process.exit(0);
    });

async function updateTokenId() {
    try {
        let allResult = await Event.find({ isTrack: 0 });

        if (allResult.length == 0) {
            console.log("No records available");
            return;
        }
        for (let counter = 0; counter < allResult.length; counter++) {
            let allIds = [];
            let receipt = await web3.eth.getTransactionReceipt(
                allResult[counter].sTransactionHash
            );
            for (
                let innerCounter = 0;
                innerCounter < receipt.logs.length;
                innerCounter++
            ) {
                allIds.push(Number(receipt.logs[innerCounter].topics[3]));
            }
            let updateIds = await Event.findOneAndUpdate(
                { sTransactionHash: allResult[counter].sTransactionHash },
                {
                    $push: { aToken: allIds },
                }
            );
            if (!updateIds || updateIds.length == 0) {
                throw "server error";
            }

            let updateTrack = await Event.findOneAndUpdate(
                { sTransactionHash: allResult[counter].sTransactionHash },
                {
                    isTrack: 1,
                }
            );
            if (!updateTrack || updateIds.length == 0) {
                throw "server error";
            }
            console.log("Data updated....");
        }
    } catch (error) {
        console.log("error = ", error);
        return;
    }
}
setInterval(async () => {
    updateTokenId();
}, 5000);
