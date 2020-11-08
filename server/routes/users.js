const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");
const async = require('async');

const  {  v4 : uuid  }  =  require ( 'uuid' ) ;
const line = require("line-pay-sdk");
const dotenv = require("dotenv");
dotenv.config();
const NodeCache = require( "node-cache" );
const lineCache = new NodeCache();




//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post("/addToCart", auth, (req, res) => {
    //해당 유저의 정보를 가져온다 (cart정보를 얻기 위해)
    User.findOne({_id: req.user._id},
        (err, userInfo) => {
            //가져온 정보에서 카트에 넣으려는 상품이 이미 있는지 확인
            let duplicate = false; //존재여부
            userInfo.cart.forEach( (item) => {
                if(item.id === req.body.productId) {
                    duplicate = true;
                }
            })
            if(duplicate) {
                //상품이 이미 있을 떄(기존정보에 업데이트)
                User.findOneAndUpdate(
                    {_id: req.user._id, "cart.id" : req.body.productId}, //갱신대상 : User._id일치 && cart.id일치하는 것
                    //{ $inc : { "cart.$.quantity" : 1} }, //increment cart의quantity를 1 increment한다
                    { $inc : { "cart.$.quantity" : req.body.count} }, //선택한 수량만큼 increment
                    { new: true}, // new:true를 넣어주면 갱신 후 데이터를 받아온다, 아래의 userInfo
                    (err, userInfo) => {
                        if(err) return res.status(200).json({ success:false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }else{
                //상품이 없을 경우(신규등록)
                User.findOneAndUpdate(
                    {_id: req.user._id}, //대상유저
                    {
                        $push: {
                            cart: { //업데이트할 정보
                                id: req.body.productId,
                                quantity : req.body.count, //선택한 수량
                                date : Date.now()
                            }
                        }
                    }, 
                    { new: true },
                    (err, userInfo) => {
                        if(err) return res.status(400).json({ success:false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});

//카트 갱신
router.get('/updateFromCart', auth, (req, res) => {
    //카트 안에 대상 상품을 갱신
    User.findOneAndUpdate(
        {_id: req.user._id, "cart.id" : req.query.id},
        {
            $set:{
                    "cart.$.quantity" : parseInt(req.query.count), //선택한 수량
                    "cart.$.date" : Date.now()
            }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })
            //product collection에서 현재 남아있는 상품들의 정보를 가져오기
            Product.find({ _id : { $in : array }})
            .populate('writer')
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    )
})

router.get('/removeFromCart', auth, (req, res) => {
    //카트 안에 지우려고 하는 상품을 삭제
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull":
            {"cart" :{"id": req.query.id}}
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })
            //product collection에서 현재 남아있는 상품들의 정보를 가져오기
            Product.find({ _id : { $in : array }})
            .populate('writer')
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    )
})

router.post('/successBuy', auth, (req, res) => {
    // User Collection의 History 필드 안에 간단한 결제정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dataOfPurchase: Date.now(),
            name : item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    // Payment Collection 안에 자세한 결제정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData
    transactionData.product = history

    //1. history 정보 저장
    User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {history: history }, $set: { cart: [] } },
        { new: true }, //업데이트 한 후 새로운 객체를 가져온다
        (err, user) => {
            if(err) return res.json({ success: false, err })
            //2. payment에 transactionData 정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) => { //doc : 구입정보
                if(err) return res.json({ success: false, err})

                //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기
                //상품당 몇개를 샀는지(quantity)
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                //여러개의 상품이 업데이트 되기 때문에 async를 사용
                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        {_id: item.id},
                        {
                            $inc: {
                                "sold" : item.quantity,  //+판매량
                                "stock" : -item.quantity //-재고수량
                            }
                        },
                        {new: false},
                        callback
                    )
                }, (err) => {
                    if(err) return res.status(400).json({ success: false, err})
                    res.status(200).json({ 
                        success: true,
                        cart: user.cart,
                        cartDeatail: [] //결제가 성공하면 cart가 비워짐
                    })
                })

            })
        }
    )
})

//line pay
const client = new line.Client({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
});
router.post('/linePay/reserve', (req, res) => {
    let amount=0;
    let host = req.body.host;
    let image = req.body.image;
    console.log(image)
    req.body.cartDetail.forEach((item) => {
        amount = amount + (item.price * item.quantity)
    })
    const options = {
        productName: req.body.cartDetail.length > 1? req.body.cartDetail[0].title+"外 "+req.body.cartDetail.length-1+"点" : req.body.cartDetail[0].title,
        amount: amount,
        currency: "JPY",
        orderId: uuid(),
        productImageUrl: req.body.image,
        confirmUrl: "http://"+host+`/api/users/linePay/confirm`
    };
    client.reservePayment(options).then((response) => {
        lineCache.set("lineCartDetail", req.body.cartDetail)
        lineCache.set("host", req.body.host)

        if(response.returnMessage !== 'Success.') return res.status(400).json({ success:false})
        res.status(200).json( {success: true, response })
    });
})

//라인페이 결제 성공시
router.get("/linePay/confirm", auth, (req, res) => {
    const cartDetail = lineCache.get("lineCartDetail")
    const host = lineCache.get("host")
  
    if (!req.query.transactionId){
      throw new Error("Transaction Id not found.");
    }
    // User Collection의 History 필드 안에 간단한 결제정보 넣어주기
    let history = [];
    let transactionData = {};

    cartDetail.forEach((item) => {
        history.push({
            dataOfPurchase: Date.now(),
            name : item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.query.transactionId
        })
    })

    // Payment Collection 안에 자세한 결제정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    transactionData.data = req.query.transactionId
    transactionData.product = history

    //1. history 정보 저장
    User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {history: history }, $set: { cart: [] } },
        { new: true }, //업데이트 한 후 새로운 객체를 가져온다
        (err, user) => {
            if(err) return res.json({ success: false, err })
            //2. payment에 transactionData 정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) => { //doc : 구입정보
                if(err) return res.json({ success: false, err})

                //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기
                //상품당 몇개를 샀는지(quantity)
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                //여러개의 상품이 업데이트 되기 때문에 async를 사용
                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        {_id: item.id},
                        {
                            $inc: {
                                "sold" : item.quantity,  //+판매량
                                "stock" : -item.quantity //-재고수량
                            }
                        },
                        {new: false},
                        callback
                    )
                }, (err) => {
                    if(err) return res.status(400).json({ success: false, err})
                    /*
                    res.status(200).json({ 
                        success: true,
                        cart: user.cart,
                        cartDeatail: [] //결제가 성공하면 cart가 비워짐
                    })
                    */
                })

            })
        }
    )

    const confirmation = {
        transactionId: req.query.transactionId,
        amount: 1,
        currency: "JPY"
    };
    client.confirmPayment(confirmation).then((response) => {
        console.log("성공 후 리다이렉트")
        console.log("http://"+host+"/user/cart")
        res.redirect("http://"+host+"/linePayConfirm");
    });
});

module.exports = router;
