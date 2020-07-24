import React, { useState, useEffect } from 'react';
import { Button, Descriptions } from 'antd'
import { useDispatch } from 'react-redux'
import { addToCart} from '../../../../_actions/user_actions'
import '../../../views/btn_count.css';

function ProductInfo(props) {

    const [Count, setCount] = useState(1);
    const [Stock, setStock] = useState(); //在庫

    useEffect(() => {
        setStock(props.detail.stock);
    }, [props.detail.stock])

    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 cart필드에 넣어준다 상품ID, 개수, 날짜
        if(Stock < Count) { //재고보다 선택수량이 많을 경우
            return alert(`現在在庫が選択した数量より足りないです。`+"\n"+`現在在庫 : ${Stock}`);
        }
        console.log(props.detail._id+" , "+ Count)
        dispatch(addToCart(props.detail._id, parseInt(Count)))
    }

    const countHandler = (event) => {
        const count_input = document.querySelector(".count_input");

        switch(event.target.className){
            case "btn_minus" :
                if(count_input.value <= 1) return false;
                count_input.value = parseInt(count_input.value) -1;
            break;
            case "count_input" :
                count_input.value =  count_input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                        if(count_input.value > 9999) {
                            count_input.value = 9999;
                        }
            break;
            case "btn_plus" :
                if(count_input.value >= 9999) return false;
                count_input.value = parseInt(count_input.value) +1;
            break;
            default : return false;
        }
        setCount(count_input.value);
    }


  return (
    <div>
        <Descriptions title="Product Info" >
            <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
            <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
            <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
            <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
        </Descriptions>
        <br />
        <br />
        <br />
        {Stock < 10?
            <span>`残り{Stock}点`</span>
        : null
        }
        <br/> 
        <span className="bx_count">
        {Count == 1?
            <button type="button" className="btn_minus" disabled="disabled" onClick={countHandler} />
            :
            <button type="button" className="btn_minus" onClick={countHandler} />
        }
            <input type="text" className="count_input" defaultValue="1" onKeyUp={countHandler}/>
            <button type="button" className="btn_plus" onClick={countHandler} />
        </span>

        <br />
        <br />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button size="large" shape="round" type="danger" onClick={clickHandler} >
                Add to Cart
            </Button>
        </div>        

    </div>
  );
}

export default ProductInfo;