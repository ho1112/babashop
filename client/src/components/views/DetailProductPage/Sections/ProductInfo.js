import React, { useState, useEffect } from 'react';
import { Button, Descriptions } from 'antd'
import { useDispatch } from 'react-redux'
import { addToCart} from '../../../../_actions/user_actions'
import '../../../views/btn_count.css';
import { useSelector } from "react-redux";

function ProductInfo(props) {

    const [Count, setCount] = useState(1);
    const [Stock, setStock] = useState(); //在庫
    const [Total, setTotal] = useState(0)

    const user = useSelector(state => state.user) //리덕스에서 유저정보를 가져온다.

    useEffect(() => {
        setStock(props.detail.stock);
        setTotal(props.detail.price);
    }, [props.detail.stock], [props.detail.price])

    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 cart필드에 넣어준다 상품ID, 개수, 날짜
        if(Stock < Count) { //재고보다 선택수량이 많을 경우
            return alert(`現在在庫が選択した数量より少ないです。`+"\n"+`現在在庫 : ${Stock}`);
        }
        //기존카트수량 + 새로 추가할 수량이 재고보다 많다면
        user.userData.cart.map( (item) => {
            if(item.id === props.detail._id) {
                if(item.quantity+parseInt(Count) > Stock) {
                    let addableQuantity = item.quantity+parseInt(Count) - Stock
                    return alert(`現在在庫が選択した数量と既存数量の合計より少ないです。`+"\n"+`現在在庫 : ${Stock}`+"\n"+`追加できる数量は${addableQuantity}点です。`);
                }
            }
        })

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

        setCount(count_input.value); //수량갱신
        setTotal(parseInt(count_input.value) * props.detail.price ); //합계갱신
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
        <div style={{ marginTop: '3rem' }}>
          <h2>商品小計(税込) : ¥{Total}</h2>
        </div>
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