import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy, updateCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sctions/UserCardBlock';
import { Empty, Result } from 'antd'
import Paypal from '../../utils/Paypal'
import Axios from 'axios';

function CartPage(props) {

  const dispatch = useDispatch();

  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false)
  const [ShowSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    let cartItems = []
    //리덕스 user state의 cart 안에 상품이 들어있는지 확인
    if(props.user.userData && props.user.userData.cart) {
      if(props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach(item => {
          cartItems.push(item.id) //리덕스의 user.UserData.cart 아이템ID를 배열에 넣어준다.
        })
        dispatch(getCartItems(cartItems, props.user.userData.cart))
        .then(response => {calculateTotal(response.payload)})
      }
    }
  }, [props.user.userData])

  //카트 합계 구하기
  let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price,10) * item.quantity
    })
    setTotal(total);
    setShowTotal(true)
  } 

  //카트 갱신처리 - 상품ID, 선택수량
  let updateFromCart = (productId, count) => {
    dispatch(updateCartItem(productId, count) )
      .then(response => {
      })
  }

  //카트 삭제
  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId) )
      .then(response => {
        if(response.payload.productInfo.length <= 0) { //카트에 상품이 하나도 없을 때
          setShowTotal(false)
        }
      })
  }

  //결제 성공 후 결제 정보 처리
  const transactionSuccess = (data) => {
    dispatch(onSuccessBuy({
      paymentData: data, //paymentData.paymentID 
      cartDetail: props.user.cartDetail
    }))
    .then(response => {
      if(response.payload.success) {
        setShowTotal(false)
        setShowSuccess(true)
      }
    })
  }

  const linePay = () => {
    let image ="https://firebasestorage.googleapis.com/v0/b/babashop-801b2.appspot.com/o/linePay%2Flinepay.jpg?alt=media&token=96c19957-13f5-4832-bc47-5e4530d31a8f"
    const body = {
      cartDetail: props.user.cartDetail,
      host : window.location.host,
      image : image
    }
    Axios.post("/api/users/linePay/reserve", body)
    .then(response => {
      if(response.data.success){
        sessionStorage.setItem("cartDetail", props.user.cartDetail)
        console.log("linePay response ▼")
        console.log(response.data.response.info.paymentUrl.web)
        window.location.replace(response.data.response.info.paymentUrl.web);
      }else{
        console.log("errrr")
      }
    })
  }



  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} updateItem={updateFromCart} />
      </div>

      {ShowTotal ?
        <div style={{ marginTop: '3rem' }}>
          <h2>小計(税込) : ¥{Total}</h2>
        </div>
        : ShowSuccess ? //결제 성공 정보가 있다면
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
          />
          : //비어 있다면
          <>
            <br />
            <Empty description={false}/>
          </>
      }

      <div style={{float:"left", width: "33%", margin : "10px"}}>
        {ShowTotal &&
          <Paypal
            total={Total}
            onSuccess={transactionSuccess}
          />
        }
        </div>
        <div style={{float:"left", width: "33%"}}>
        {ShowTotal &&
            <button onClick={linePay} style={{border:0, float:"left", cursor: "pointer"}} >
              <img src="https://firebasestorage.googleapis.com/v0/b/babashop-801b2.appspot.com/o/linePay%2FLINE-Pay(h)_W238_n.png?alt=media&token=db350e15-9f32-4a5b-9adf-30c22f6d8e30"></img>
            </button>
        }
        </div>
        <div>
          <span>
          sandBoxモードなので実際お支払いは行いません。<br />
          Paypalテストアカウント : <br />sb-pugl53685384@personal.example.com <br />
          password : test2020
          </span>
        </div>

    </div>
  )
}

export default CartPage;