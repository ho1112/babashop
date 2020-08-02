import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd'
import './ProductUSerResponse.css'
import ProductReview from './ProductReview'
import ProductQnA from './ProductQnA'

const { TabPane } = Tabs;
function ProductUserResponse(props) {

  const dateZeroSetting = (date) => {
    return date > 9 ?
    date :"0"+date;
  }

  return (
    <div className="card-container" >
      <Tabs type="card" size='large' >
        <TabPane tab="レビュー" key="2">
          <ProductReview detail={props.detail} getZero={dateZeroSetting} />
        </TabPane>
        <TabPane tab="商品Q&A" key="3">
          <ProductQnA detail={props.detail} getZero={dateZeroSetting} />
        </TabPane>
        <TabPane tab="商品説明" key="1" >
        </TabPane>
      </Tabs>
    </div>
  );
}


export default ProductUserResponse;
