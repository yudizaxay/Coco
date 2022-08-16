$(document).ready(async function () {
    fetchTokenId();
});

const fetchTokenId = async () => {
    try {
        let sHash = await getUrlVars();
        console.log("hash = ", sHash);
        $.ajax({
            url: `/api/v1/user/token/${sHash}`,
            method: "GET",
            processData: false,
            contentType: false,
            success: function (xhr, status, result) {
                console.log("success = ", result.responseJSON.data);
                renderNFT(
                    result.responseJSON.data.data,
                    result.responseJSON.data.price,
                    result.responseJSON.data.owner,
                    result.responseJSON.data.sHash
                );
                return;
            },
            error: function (xhr, status, error) {
                console.log("error==========", xhr);
                swal("oops..!", xhr.responseJSON.message, "error");

                return;
            },
        });
    } catch (error) {
        console.log("error = ", error);
        return;
    }
};

const renderNFT = async (data, price, owner, hash) => {
    try {
        for (nft of data) {
            let content = `<tr>
            <td>${nft}</td>
            <td>${price}</td>
            <td><button onClick="buy($(this))" class="btn btn-primary" price="${price}" tokenid="${nft}" owner="${owner}" hash="${hash}">Buy</button></td>
        </tr>`;
            $("#userRowsContainer").append(content);
        }
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "Some error occured", "error").then((ok) => {
            if (ok) location.reload();
        });
        return;
    }
};

const buy = async (element) => {
    try {
        console.log("token id = ", element[0].attributes.tokenid.nodeValue);
        console.log("token owner = ", element[0].attributes.owner.nodeValue);
        console.log("price= ", element[0].attributes.price.nodeValue);
        console.log("hash= ", element[0].attributes.hash.nodeValue);
        if (!window.localStorage.getItem("wallet")) {
            swal("oops..", "Please connect your wallet first", "error");
            return;
        }
        await connectMetamask();
        var oContract = new window.web3.eth.Contract(
            window.CONTRACT_DATA.abi,
            window.CONTRACT_DATA.address
        );
        var balance = await web3.eth.getBalance(
            window.localStorage.getItem("wallet")
        );
        console.log("balance = ", balance);
        let nftPrice = window.web3.utils.toWei(
            element[0].attributes.price.nodeValue
        );
        console.log(
            "balance2 = ",
            window.web3.utils.toWei(
                element[0].attributes.price.nodeValue,
                "ether"
            )
        );
        if (balance < Number(nftPrice)) {
            swal("oops..!", "Unsufficient balance", "error").then((ok) => {
                if (ok) location.reload();
            });
            return;
        }
        if (
            window.localStorage.getItem("wallet") ==
            element[0].attributes.owner.nodeValue
        ) {
            swal("oops..!", "You cannot purchase your own NFT", "error").then(
                (ok) => {
                    if (ok) location.reload();
                }
            );
            return;
        }
        const txEstimateGas = await oContract.methods
            .buy(
                element[0].attributes.owner.nodeValue,
                window.localStorage.getItem("wallet"),
                element[0].attributes.tokenid.nodeValue
            )
            .estimateGas({
                from: window.localStorage.getItem("wallet"),
                value: window.web3.utils.toWei(
                    element[0].attributes.price.nodeValue,
                    "ether"
                ),
            })
            .catch((error) => {
                console.log("error==", error);
                swal("oops..!", "Some error occured", "error").then((ok) => {
                    if (ok) location.reload();
                });
                return;
            });
        console.log("gas = ", txEstimateGas);
        await oContract.methods
            .buy(
                element[0].attributes.owner.nodeValue,
                window.localStorage.getItem("wallet"),
                element[0].attributes.tokenid.nodeValue
            )
            .send({
                from: window.localStorage.getItem("wallet"),
                value: window.web3.utils.toWei(
                    element[0].attributes.price.nodeValue,
                    "ether"
                ),
            })
            .once("transactionHash", async (transactionHash) => {
                console.log("transactionHash ==", transactionHash);
                swal("Purchased", "Successfully purchased", "success").then(
                    (ok) => {
                        if (ok) location.reload();
                    }
                );
                await removeNft(
                    element[0].attributes.hash.nodeValue,
                    element[0].attributes.tokenid.nodeValue
                );
            })
            .on("receipt", (receipt) => {
                console.log("receipt==", receipt);
            })
            .catch((error) => {
                console.log("error==", error);
                swal(
                    "oops..!",
                    "You may have reject the transaction",
                    "error"
                ).then((ok) => {
                    if (ok) location.reload();
                });
                return;
            });
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "Some error occured", "error").then((ok) => {
            if (ok) location.reload();
        });
        return;
    }
};

const removeNft = async (hash, token) => {
    try {
        $.ajax({
            url: `/api/v1/user/updateToken/${hash}/token/${token}`,
            method: "GET",
            processData: false,
            contentType: false,
            success: function (xhr, status, result) {
                console.log("success = ", result.responseJSON.data);
                return;
            },
            error: function (xhr, status, error) {
                console.log("error==========", xhr);
                swal("oops..!", xhr.responseJSON.message, "error");
                return;
            },
        });
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "server error, please try after a while", "error");
        return;
    }
};

async function connectMetamask() {
    if (window.ethereum) {
        try {
            console.log("inside....");
            window.web3 = new Web3(ethereum);
            web3 = new Web3(web3.currentProvider);
        } catch (err) {
            console.log("err==", err);
            swal("oops..!", "some error occured", "error");
            return;
        }
    }
}

async function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars.h;
}

console.log = function() {}
