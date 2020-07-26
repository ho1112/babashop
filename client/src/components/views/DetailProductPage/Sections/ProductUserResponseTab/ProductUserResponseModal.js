import React, { useState } from 'react';
import './ProductUserResponseModal.css'
import { Checkbox } from 'antd';

function ProductUserResponseModal(props) {

    const [textCount, setTextCount] = useState(0);
    const [checked, setchecked] = useState(false);

    const textCountHandler = (event) => {
        setTextCount(event.target.value.length)
    }

    const checkedHandler = (event) => {
        setchecked(event.target.checked)
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
                </textarea>
                <span className="text_count">
                    <span className="num">{textCount}</span>
                    /1000
                </span>
            </div>
            <div>
                <Checkbox onChange={checkedHandler}>비공개</Checkbox>
            </div>
            <br />
            <div className="popup_btn">
                <button className="btn_submit">투고</button>
                <button className="btn_close"></button>
            </div>
            </div>
        </div>
    </div>
  );
}

export default ProductUserResponseModal;