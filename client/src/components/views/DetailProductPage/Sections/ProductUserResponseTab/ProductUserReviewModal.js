import React, { useState } from 'react';
import './ProductUserResponseModal.css'
import { Rate } from 'antd';
import Axios from 'axios';
import { useSelector } from "react-redux";

function ProductUserReviwModal(props) {

    const user = useSelector(state => state.user)

    const [textCount, setTextCount] = useState(0);
    const [rate, setRate] = useState(1);
    const [review, setReview ] = useState("")

    const textCountHandler = (event) => {
        setTextCount(event.target.value.length)
        setReview(event.target.value)
    }

    const rateHandler = (value) => {
        setRate(value)
    }

    const submitHandler = (event) => {
        if(rate == 0){
            return false;
        }
        //등록처리
        event.preventDefault();
        //submit -> server
        console.log(props.detail._id)
        console.log(user.userData._id)
        const body = {
        productId: props.detail._id, //상품아이디
        writer: user.userData.name, //from redux
        review: review,
        rate: rate,
        like: []
        }

        Axios.post("/api/product/review", body)
            .then(response => {
            if(response.data.success) {
                alert("success upload");
                //부모 컴포넌트의 리뷰 리프레쉬 요청
                props.submit(response.data.productInfo)
            } else {
                alert("failed upload");
                console.log(response.data.err);
            }
            })
    }

  return (
    <div className="popup-layer" onClick={props.cancel}>
        <div className="popup_common">
        <div style={{padding: '40px 40px 0'}}>    
            <div>
                <h1 style={{textAlign:'center'}}>商品レビュー登録</h1>
            </div>
            <div className="popup_textArea">
                <textarea placeholder="商品のレビューを書いてください。" onKeyUp={textCountHandler}  maxLength="1000" style={{width: '100%'}}>
                    {review}
                </textarea>
                <span className="text_count">
                    <span className="num">{textCount}</span>
                    /1000
                </span>
            </div>
            <div>
                <Rate onChange={rateHandler} defaultValue={1} ></Rate>
            </div>
            {rate == 0?
                <div style={{color:'red'}}>*商品について評価をしてください。</div>
                :
                <div>　</div>
            }
            <br />
            <div className="popup_btn">
                <button className="btn_submit" onClick={submitHandler}>등록</button>
                <button className="btn_close" onClick={props.cancel}></button>
            </div>
            </div>
        </div>
    </div>
  );
}

export default ProductUserReviwModal;