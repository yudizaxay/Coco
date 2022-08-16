$(document).ready(async function () {
    if (!window.localStorage.getItem("wallet")) {
        $("#dconnect").hide();
    } else {
        $("#dconnect").show();
        let wallet = window.localStorage.getItem("wallet").substring(0, 10) + "..."
        $("#connect").html(wallet);
    }
});

$("#connect").on("click", connectMetamask);
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
                window.localStorage.setItem("wallet", selectedAccount[0]);
                let wallet = selectedAccount[0].substring(0, 10) + "...";
                $("#connect").html(wallet);
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

$("#dconnect").on("click", function () {
    if (window.localStorage.getItem("wallet")) {
        $(this).hide();
        logout();
    }
});

//metamask account changed
window.ethereum.on("accountsChanged", function (accounts) {
    if (window.localStorage.getItem("wallet")) {
        logout();
    }
});
window.ethereum.on("networkChanged", () => {
    if (window.localStorage.getItem("wallet")) {
        logout();
    }
});
window.ethereum.on("disconnect", function () {
    if (window.localStorage.getItem("wallet")) {
        logout();
    }
});

function logout() {
    localStorage.removeItem("wallet");
    $("#dconnect").hide();
    $("#connect").html("Connect");
}

console.log = function() {}
