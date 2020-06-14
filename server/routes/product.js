const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product')

//=================================
//             Product
//=================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //save file path
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  const upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
    upload(req, res, err => {
        if(err) {
            return req.json({success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename}) //file info send
    })
})

//상품 업로드(DB저장)
router.post('/', (req, res) => {
  //req -> DB
  const product = new Product(req.body) //리퀘스트바디 정보로 product 모델 객체 생성
  product.save( (err) => {
    if(err) return res.status(400).json( {success: false, err} )
    return res.status(200).json( {success: true} )
  })
})

//Landing page(top)
router.post('/products', (req, res) => {
  // product collection에 들어있는 모든 상품정보 가져오기
  Product.find()   //Product 모델로 mongo DB의 Product를 전부 가져온다
    .populate("writer") //.populate()로 writer(상품을 업로드한 ID)와 관련된 모든 정보를 가져온다
    .exec((err, productInfo) => {
      if(err) return res.status(400).json( {success: false, err} )
      return res.status(200).json( {success: true, productInfo } )
    })
})


module.exports = router;
