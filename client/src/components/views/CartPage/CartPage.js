import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import UserCardBlock from './Sctions/UserCardBlock';

function CartPage(props) {

  const dispatch = useDispatch();

  const [Total, setTotal] = useState(0)

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
  } 

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail} />
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Total Amount : ${Total}</h2>
      </div>
    </div>
  )
}

export default CartPage;