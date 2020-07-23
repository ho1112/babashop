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
    continents: { //대륙구분(아시아, 유럽, 아프리카...)
        type: Number,
        default: 1
    },
    stock: { //재고
        type: Number,
        default: 100
    }
}, { timestamps: true} ) //update time auto set

ProductSchema.index({ //검색 mongoDB .find() 검색대상, 가중치 설정
    title:'text',
    description:'text'
}, {
    weights:{
        title: 5,
        description: 1 //명시하지 않으면 default 1이 들어간다
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product }