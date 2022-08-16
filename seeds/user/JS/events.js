$(document).ready(async function () {
    fetchAllNfts();
});

const fetchAllNfts = async () => {
    try {
        $.ajax({
            url: "/api/v1/user/fetch",
            method: "GET",
            processData: false,
            contentType: false,
            success: function (xhr, status, result) {
                console.log("success = ", result.responseJSON.data);
                renderNFTs(result.responseJSON.data.data);
                return;
            },
            error: function (xhr, status, error) {
                console.log("error==========", xhr);
                swal("oops..!", xhr.responseJSON.message, "error");
                clear();
                return;
            },
        });
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "some error occured", "error");
        return;
    }
};

const renderNFTs = async (data) => {
    try {
        if (data.length == 0) {
            $("#eventMsg").show();
            return;
        }
        for (result of data) {
            let content = `<li style="list-style: none;" class="col-lg-4 col-md-6 mb-0" style="margin-bottom: 50px;"><hr>
            <div class="card" style="width: 15rem;height:22rem;">
                <img style="height:250px;width:auto;" src=${result.sProfilePicUrl}>
                <div class="card-body">
                  <p style="color:blue;" class="card-text">Name : ${result.sEventName}</p>
                 <a href="/nfts?h=${result.sTransactionHash}">Click to view more</a>
                </div>
              </div></li>`;
            $("#nftCollections").append(content);
        }
    } catch (error) {
        console.log("error = ", error);
        swal("oops..!", "some error occured", "error");
        return;
    }
};

console.log = function() {}
