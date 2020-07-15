const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product')

//const { storage } = require('../config/firebaseConfig')

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



async function saveImage(file, contents) {
  const config = {
    action: 'read',
    expires: '03-01-2500'
  };
  const promises = [];
  let url = "";
  console.log("1 saveImage");
  await file.save(contents);
  console.log("2 file.save")
  url = await Promise.all(await file.getSignedUrl(config) );
  console.log("3 "+url)
  promises.push(url)
  console.log("4 .push")
}

async function upload() {
    //const url = await getDownloadURL(file);
    console.log("upload " )
    //return url;
}

async function getDownloadURL(file) {
  let params = {
    action: 'read',
    expires: '03-01-2500'
  }
  return file.getSignedUrl(params);
  
}

async function getFirebase(req) {
  const now = Date.now();
  let urlArray = [];
  const pendingPromises  = [];
  for(let i = 0; i < req.body.images.length; i++){
    pendingPromises.push(new Promise((resolve, reject) => {
      let fileName = 'images/'+now+"_"+req.body.images[i].path;
      let base64 = req.body.images[i].base64;
      const file = bucket.file('images/'+now+"_"+req.body.images[i].path);
      const contents = Buffer.from(base64.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
      const config = {
        action: 'read',
        expires: '03-01-2500'
      };
      file.save(contents);
      console.log("file.save end")
      resolve( file.getSignedUrl(config) );
      console.log("file.getsigned end")
    })); //push
    console.log("pendingPromises push end"+pendingPromises[0])
  } //for

  Promise.all(pendingPromises)
  .then( urls => {
    console.log("then : "+urls)
    console.log(urls.length)
    console.log(urls[0])
    urls.map( (url, index) => {
      req.body.images[index] = url;
    })
    
  })
  .catch(() => console.log('error'))
  //console.log("urlArray ; "+urlArray)
  //return urlArray;
}

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
console.log('router'+productIds)
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


module.exports = router;
