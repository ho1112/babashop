const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product')


const { bucket } = require('../config/firebaseConfig')
let async = require('async');



//=================================
//             Product
//=================================
/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //save file path
      console.log("2");
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      console.log("3");
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
const upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
  //가져온 이미지를 저장
  console.log("1");
    upload(req, res, err => {
        if(err) {
            return req.json({success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename}) //file info send
    })
})
*/

//상품 업로드(DB저장)
router.post('/', (req, res) => {
  //req -> DB
  const now = Date.now();
  // firebase에 이미지 저장
  if(req.body.images){
    let array = new Array;
    const now = Date.now();
    let urlArray = [];
    const pendingPromises  = [];
    //프론트에서 받은 이미지들을 업로드 한 후, url을 배열에 넣어준다.
    for(let i = 0; i < req.body.images.length; i++){ 
      pendingPromises.push(new Promise((resolve, reject) => {
      let base64 = req.body.images[i].base64;
      const file = bucket.file('images/'+now+"_"+req.body.images[i].path);
      const contents = Buffer.from(base64.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
      const config = {
        action: 'read',
        expires: '03-01-2500'
      };
      file.save(contents); //파일 업로드
      resolve( file.getSignedUrl(config) ); //업로드 된 파일의 다운로드url취득
      })); //push
    } //for

    Promise.all(pendingPromises)
    .then( urls => {
      urls.map( (url, index) => {
      req.body.images[index] = url;
    })
      product = new Product(req.body) //리퀘스트바디 정보로 product 모델 객체 생성
      product.save( (err) => {
        if(err) return res.status(400).json( {success: false, err} )
        return res.status(200).json( {success: true} )
      })
  })
  .catch(() => console.log('error'))

  }else{
    if(err) return res.status(400).json( {success: false, err} )
  }
})

//상품 리뷰(DB저장)
router.post('/review', (req, res) => {
  //req -> DB
  //상품 안의 리뷰를 등록(갱신)
  Product.findOneAndUpdate(
    {_id: req.body.productId},
    {
        $push:{
          review: {
            writer:req.body.writer, 
            review:req.body.review,
            date:Date.now(),
            rate:req.body.rate,
            like:req.body.like
          }
        }
    },
    { upsert: true, new: true },
    (err, productInfo) => {
      if(err) return res.status(400).json({ success:false, err})
      res.status(200).json( {success: true, productInfo })
    }
)
})

//상품 질문(DB저장)
router.post('/qna', (req, res) => {
  //req -> DB
  //상품 안의 질문을 등록(갱신)
  Product.findOneAndUpdate(
    {_id: req.body.productId},
    {
        $push:{
          qna: {
            writer:req.body.writer, 
            qna:req.body.qna,
            date:Date.now(),
            public:req.body.public
          }
        }
    },
    { upsert: true, new: true },
    (err, productInfo) => {
      if(err) return res.status(400).json({ success:false, err})
      res.status(200).json( {success: true, productInfo })
    }
)
})

//Landing page(top)
router.post('/products', (req, res) => {
  console.log('top top ')
  // product collection에 들어있는 모든 상품정보 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm
  //filter
  let findArgs = {};

  for(let key in req.body.filters) {
    if(req.body.filters[key].length > 0) { //key -> continents, price
      console.log('key',key)
      if(key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //Greater than equal 크거나 같고
          $lte: req.body.filters[key][1]  //Less than equal 작거나 같은
          //ex) [200,249] $gte:200, $lte:249 -> 200~249
        }
      } else {
        findArgs[key] = req.body.filters[key]
      }
    }
  }

  console.log('findArgs', findArgs)
  if(term){ //검색어가 있을 경우
    Product.find(findArgs)   //Product 모델로 mongo DB의 Product를 전부 가져온다
      //.find({ $text: {$search: term } }) //검색어-완전일치
      .find({ "title": { '$regex': term } }) //like 검색
      .populate("writer") //.populate()로 writer(상품을 업로드한 ID)와 관련된 모든 정보를 가져온다
      .skip(skip) //몇번부터 가져올 것인지 skip~ limit만큼
      .limit(limit) //가져올 갯수
      .exec((err, productInfo) => {
        if(err) return res.status(400).json( {success: false, err} )
        return res.status(200).json( {
          success: true, productInfo,
          postSize: productInfo.length //상품 갯수
        })
      })
  } else {
    Product.find(findArgs)   //Product 모델로 mongo DB의 Product를 전부 가져온다
      .populate("writer") //.populate()로 writer(상품을 업로드한 ID)와 관련된 모든 정보를 가져온다
      .skip(skip) //몇번부터 가져올 것인지 skip~ limit만큼
      .limit(limit) //가져올 갯수
      .exec((err, productInfo) => {
        if(err) return res.status(400).json( {success: false, err} )
        return res.status(200).json( {
          success: true, productInfo,
          postSize: productInfo.length //상품 갯수
        })
      })
  }
})

router.get('/products_by_id', (req, res) => {
  let type = req.query.type
  let productIds = req.query.id
  if(type === "array") {
    //ex) id=5e995643,7fv8d6f8g,48vtd6ee4 -> productIds =['5e995643','7fv8d6f8g','48vtd6ee4']변경
    let ids = req.query.id.split(',');
    productIds = ids.map(item => {
      return item;
    })
  }

  //productId를 이용해 DB에서 productId와 같은 상품을 가져온다.
  Product.find({ _id: { $in: productIds} }) //복수의 상품이 들어올 수 있기 때문에 $in
      .populate('writer')
      .exec((err, product) => {
        if(err) return res.status(400).send(err)
        return res.status(200).send(product)
      })
})

/*
//line pay
const client = new line.Client({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
});

router.post('/linePay/reserve', (req, res) => {
  console.log("linepay reserve")
  let amount=0;
  req.body.cartDetail.forEach((item) => {
      amount = amount + (item.price * item.quantity)
  })


  const options = {
    productName: req.body.cartDetail.length > 1? req.body.cartDetail[0].title+"外 "+req.body.cartDetail.length-1+"点" : req.body.cartDetail[0].title,
    amount: amount,
    currency: "JPY",
    orderId: uuid(),
    confirmUrl: `http://localhost:3000/api/users/linePay/confirm`
    //confirmUrl: `/api/product/linePay/confirm`
  };

  client.reservePayment(options).then((response) => {
    console.log("Reservation was made!");
    console.log("Response: ", response);
    console.log(response.info.paymentUrl.web)
    lineCache.set("lineCartDetail", req.body.cartDetail)

    if(response.returnMessage !== 'Success.') return res.status(400).json({ success:false})
    res.status(200).json( {success: true, response })

    //res.redirect(response.info.paymentUrl.web);
  });

})

// Router configuration to recieve notification when user approves payment.
//결제성공
router.get("/linePay/confirm", (req, res) => {
  console.log("걸제성공 confirm")
  const value = lineCache.get("lineCartDetail")
  console.log(value)

  if (!req.query.transactionId){
    throw new Error("Transaction Id not found.");
  }

  const confirmation = {
    transactionId: req.query.transactionId,
    amount: 1,
    currency: "JPY"
  };

  console.log(`Going to confirm payment with following options.`);
  console.log(confirmation);

  client.confirmPayment(confirmation).then((response) => {
    res.send("Payment has been completed.");
  });
});
*/
module.exports = router;
