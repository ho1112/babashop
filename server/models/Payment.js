const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const PaymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        defaul: []
    }
    
}, { timestamps: true} ) //update time auto set

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = { Product }