import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy, updateCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sctions/UserCardBlock';
import { Empty, Result } from 'antd'
import Paypal from '../../utils/Paypal'


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
      paymentData: data,
      cartDetail: props.user.cartDetail
    }))
    .then(response => {
      if(response.payload.success) {
        setShowTotal(false)
        setShowSuccess(true)
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
          <h2>Total Amount : ${Total}</h2>
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

      {ShowTotal &&
        <Paypal
          total={Total}
          onSuccess={transactionSuccess}
        />
      }

    </div>
  )
}

export default CartPage;