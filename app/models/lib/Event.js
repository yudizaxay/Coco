const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    sWalletAddress: {
        type: String,
        require: true
    },
    sTransactionHash:{
        type : String,
        unique : true,
        require : true
    },
    sEventName: {
        type: String,
        require: true
    },
    sEventDescription: {
        type: String,
        require: true
    },
    nTicket: {
        type:Number,
        require: true
    },
    nPrice: {
        type: Number,
        require: true
    },
    aToken:{
        type : Array
    },
    isTrack:{
        type:Number,
        default: 0
    },
   
    sProfilePicUrl: String,
   
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);