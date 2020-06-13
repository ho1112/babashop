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


module.exports = router;
