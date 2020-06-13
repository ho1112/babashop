const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const ProductSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: { //설명, 
        type: String
    },
    price: { //가격
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: { //판매량
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: { //조회수
        type: Number,
        default: 0
    },
    continents: {
        type: Number,
        default: 1
    }
}, { timestamps: true} ) //update time auto set

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product }