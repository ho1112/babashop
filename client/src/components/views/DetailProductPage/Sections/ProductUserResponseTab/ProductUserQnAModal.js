import React, { useState } from 'react';
import './ProductUserResponseModal.css'
import { Checkbox } from 'antd';
import Axios from 'axios';
import { useSelector } from "react-redux";

function ProductUserQnAModal(props) {

    const user = useSelector(state => state.user)

    const [textCount, setTextCount] = useState(0);
    const [checked, setchecked] = useState(false);
    const [inputCheck, setInputCheck] = useState(false);
    const [qna, setQna ] = useState("")

    const textCountHandler = (event) => {
        setInputCheck(false)
        setTextCount(event.target.value.length)
        setQna(event.target.value)
    }

    const checkedHandler = (event) => {
        setchecked(event.target.checked)
    }

    const submitHandler = (event) => {
        if(textCount == 0){
            setInputCheck(true)
            return false;
        }
        //등록처리
        event.preventDefault();
        const body = {
        productId: props.detail._id, //상품아이디
        writer: user.userData.name, //from redux
        qna: qna,
        public: checked ? "private" : "public" //공개여부
        }
        
        Axios.post("/api/product/qna", body)
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
                <h1 style={{textAlign:'center'}}>商品Q&A投稿</h1>
            </div>
            <div className="popup_textArea">
                <textarea placeholder="商品についての不明点をご投稿いただけます。" onKeyUp={textCountHandler}  maxLength="1000" style={{width: '100%'}}>
                    {qna}
                </textarea>
                <span className="text_count">
                    <span className="num">{textCount}</span>
                    /1000
                </span>
            </div>
            <div>
                <Checkbox onChange={checkedHandler}>비공개</Checkbox>
            </div>
            {inputCheck == true?
                <div style={{color:'red'}}>*内容を入力してください。</div>
                :
                <div>　</div>
            }
            <div className="popup_btn">
                <button className="btn_submit" onClick={submitHandler}>투고</button>
                <button className="btn_close" onClick={props.cancel}></button>
            </div>
            </div>
        </div>
    </div>
  );
}

export default ProductUserQnAModal;