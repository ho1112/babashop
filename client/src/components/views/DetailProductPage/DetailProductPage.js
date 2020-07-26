import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import ProductUserResponse from './Sections/ProductUserResponseTab/ProductUserResponse'
import { Row, Col } from 'antd'

function DetailProductPage(props) {

  const productId = props.match.params.productId //props에서 _id를 가져온다

  const [Product, setProduct] = useState({});

    useEffect(() => {
      axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
          .then(response => {
            setProduct(response.data[0])
          })
          .catch(err => alert(err))
  }, [])

  return (
    <div style={{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16,16]}>
        <Col lg={12} sm={24}>
          {/*Product Image */}
          <ProductImage detail={Product}/>
        </Col>
       <Col lg={12} sm={24}>
        {/* Product Info */}
        <ProductInfo detail={Product}/>
       </Col>
      </Row>

      <br />
      <br />
      
      <ProductUserResponse  />

</div>


  );
}

export default DetailProductPage;