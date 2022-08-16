$(document).ready(async function () {
    // $("#message").hide();
    // $("div[name='loader']").hide();
});

$("#submitEvent").on("click", async function (e) {
    try {
        e.preventDefault();
        if (!window.localStorage.getItem("wallet")) {
            swal("oops..", "Please connect your wallet first", "error");
            return;
        }

        let sWalletAddress = window.localStorage.getItem("wallet");
        let sEventName = $("#name").val();
        let sEventDescription = $("#description").val();
        let nTicket = $("#tickets").val();
        let nPrice = $("#price").val();
        let oImage = $("#cover")[0].files[0];

        console.log("image = ", oImage);

        if (
            !sEventName ||
            !sEventDescription ||
            !nTicket ||
            !nPrice ||
            !oImage
        ) {
            swal("oops..", "All fields are required", "error");
            return;
        }
        if (nPrice == 0) {
            swal("oops..", "Price shouldn't be 0", "error");
            return;
        }
        $(this).prop("disabled", true);
        $("#message").show();
        $("div[name='loader']").show();
        await connectMetamask();
        let sTransactionHash = await contractSetup(sWalletAddress, nTicket);
        console.log("hash = ", sTransactionHash);
        var fd = new FormData();
        fd.append("sWalletAddress", sWalletAddress);
        fd.append("sEventName", sEventName);
        fd.append("sEventDescription", sEventDescription);
        fd.append("nTicket", nTicket);
        fd.append("nPrice", nPrice);
        fd.append("file", oImage);
        fd.append("sTransactionHash", sTransactionHash);

        $.ajax({
            url: "/api/v1/user/create",
            method: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function (xhr, status, result) {
                console.log("success = ", result);
                swal("Success", "Event created successfully", "success");
                clear();
                $(this).prop("disabled", false);
                $("#message").hide();
                $("div[name='loader']").hide();
                return;
            },
            error: function (xhr, status, error) {
                console.log("error==========", xhr);
                swal("oops..!", xhr.responseJSON.message, "error");
                clear();
                $(this).prop("disabled", false);
                $("#message").hide();
                $("div[name='loader']").hide();
                return;
            },
        });
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "You may have cancel the transaction", "error");
        clear();
        $(this).prop("disabled", false);
        $("#message").hide();
        $("div[name='loader']").hide();
    }
});

const contractSetup = async (wallet, quantity) => {
    try {
        let sHash = "";
        var oContract = new window.web3.eth.Contract(
            window.CONTRACT_DATA.abi,
            window.CONTRACT_DATA.address
        );
        console.log("contarct===", oContract);
        console.log("wallet = ", wallet);
        console.log("quantity = ", quantity);

        const txEstimateGas = await oContract.methods
            .mintToken(wallet, quantity)
            .estimateGas({
                from: window.localStorage.getItem("wallet"),
            })
            .catch((error) => {
                console.log("error==", error);
                swal("oops..!", "Some error occured", "error").then((ok) => {
                    if (ok) location.reload();
                });
                return;
            });

        console.log("txEstimateGas == ", txEstimateGas);
        await oContract.methods
            .mintToken(wallet, quantity)
            .send({
                from: window.localStorage.getItem("wallet"),
            })
            .once("transactionHash", async (transactionHash) => {
                console.log("transactionHash ==", transactionHash);
                sHash = transactionHash;
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
                return reject;
            });
        return sHash;
    } catch (error) {
        console.log("error=", error);
        return;
    }
};

async function connectMetamask() {
    if (window.ethereum) {
        try {
            console.log("inside....");
            window.web3 = new Web3(ethereum);
            web3 = new Web3(web3.currentProvider);
            ethereum.autoRefreshOnNetworkChange = false;
            selectedAccount = await ethereum.request({
                method: "eth_requestAccounts",
            });

            network = await ethereum.request({
                method: "net_version",
            });
            console.log("selected network==", network);
            console.log("selected account==", selectedAccount[0]);

            if (selectedAccount == undefined) {
                swal(
                    "oops..!",
                    "Please Install Metamask and try again!",
                    "error"
                );
                return;
            }
            if (setNetworkName(network) != "BSC Testnet") {
                console.log("Please select BSC Testnet network only");
                swal(
                    "oops..!",
                    "Wrong network selected! select BSC Testnet and try again",
                    "error"
                );
                return;
            }
            if (selectedAccount != undefined && network != undefined) {
                $("#connect").html("wallet connected");
                window.localStorage.setItem("wallet", selectedAccount[0]);
                $("#dconnect").show();
                return;
            }
        } catch (err) {
            console.log("err==", err);
            swal("oops..!", "some error occured", "error");
            return;
        }
    } else {
        swal("oops..!", "Please Install Metamask and try again!", "error");
        return;
    }
}

function setNetworkName(network) {
    let networkName;
    switch (network) {
        case "137":
            networkName = "MainNet";
            break;
        case "2":
            networkName = "Morden";
            break;
        case "3":
            networkName = "Ropsten";
            break;
        case "4":
            networkName = "Rinkeby";
            break;
        case "42":
            networkName = "Kovan";
            break;
        case "56":
            networkName = "BSC Mainnet";
            break;
        case "97":
            networkName = "BSC Testnet";
            break;
        case "80001":
            networkName = "Matic Testnet";
            break;
        default:
            networkName = "Unknown";
    }
    return networkName;
}

function clear() {
    $("#name").val("");
    $("#description").val("");
    $("#tickets").val("");
    $("#price").val("");
    $("#cover").val("");
}

console.log = function() {}
