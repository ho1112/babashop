import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd'
import './ProductUSerResponse.css'
import ProductReview from './ProductReview'
import ProductQnA from './ProductQnA'

const { TabPane } = Tabs;
     function ProductUserResponse() {
        return (
          <div className="card-container" >
            <Tabs type="card" size='large' >
              <TabPane tab="レビュー" key="2">
                <ProductReview />
              </TabPane>
              <TabPane tab="商品Q&A" key="3">
                <ProductQnA />
              </TabPane>
              <TabPane tab="商品説明" key="1" >
                <p>Content of Tab Pane 1</p>
                <p>Content of Tab Pane 1</p>
                <p>Content of Tab Pane 1</p>
              </TabPane>
            </Tabs>
          </div>
        );
      }


      export default ProductUserResponse;
