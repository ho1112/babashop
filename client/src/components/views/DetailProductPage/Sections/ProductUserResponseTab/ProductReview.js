import React, { useState } from 'react';
import { Rate } from 'antd'
import ProductUserResponseModal from './ProductUserResponseModal'


function ProductReview() {

    const [showReviewModal, setshowReviewModal] = useState(false);

    const data = [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
      ];

      const inputReview = () => {
        setshowReviewModal(true);
      }

      const ReviewUploadHandler = () => {
        console.log("ok")
        setshowReviewModal(false);
      }

      const showReviewCancel = (event) => {
          if(event.target.className === "popup-layer"){
              setshowReviewModal(false);
          }
      }


  return (
    <div style={{marginLeft: '10%', marginRight: '10%'}}>
        <h1>レビュー {data.length}</h1>
        <br />
        <button>오스스메순</button>
        <button>신착순</button>
        <button onClick={inputReview}>리뷰등록</button>
        <br />
        <hr />
        <div>
            {data.map( (item,index) => (
                <>
                <Rate disabled  defaultValue={2} />
                <p key={index}>{item.title}</p>
                <br />
                <div style={{display:'flex'}}>
                    <p>writer</p>
                    <p>2020-07-26 12:00:00</p>
                    <p>추천</p>
                    <button>추천버튼</button>
                </div>
                <hr />
                </>
            ))}
        </div>

        {showReviewModal &&
            <ProductUserResponseModal cancel={showReviewCancel} />
        }

    </div>
  );
}

export default ProductReview;