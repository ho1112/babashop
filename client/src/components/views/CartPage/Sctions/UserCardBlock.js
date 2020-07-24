import React, { useState } from 'react';
import "./UserCardBlock.css";

function UserCardBlock(props) {

  const [Count, setCount] = useState();

  const renderCartImage = (images) => {
    if(images.length > 0) {
      let image = images[0]
      return `${image}`
    }
  }

  const countHandler = (event, stock, productId) => {
    const count_input = event.target.parentNode.querySelector(".count_input");

    //현재 재고 이상을 선택했을 경우 에러메시지
    if(count_input.value >= stock) {
      count_input.value = stock;
      return alert(`現在在庫が選択した数量より足りないです。`+"\n"+`現在在庫 : ${stock}`);
    }

    switch(event.target.className){
        case "btn_minus" :
            if(count_input.value <= 1) return false;
            count_input.value = parseInt(count_input.value) -1;
        break;
        case "count_input" :
            count_input.value =  count_input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                if(count_input.value > 9999) { //최고 선택수량은 9999로
                    count_input.value = 9999;
                }
        break;
        case "btn_plus" :
            if(count_input.value >= 9999) return false;
            count_input.value = parseInt(count_input.value) +1;
        break;
        default : return false;
    }
    props.updateItem(productId, parseInt(count_input.value)) //cartPage에 선택수량 갱신처리를 요청
}

  const renderItems = () => (
    props.products && props.products.map((product,index) => (
      <tr key={index}>
        <td>
          <img style={{ width: '70px'}} alt="product"
            src={renderCartImage(product.images)} />
        </td>
        <td>
          {product.title}
        </td>
        <td>
          <span className="bx_count">
          {product.quantity == 1?
              <button type="button" className="btn_minus" disabled="disabled" onClick={(event) => countHandler(event, product.stock, product._id)} />
              :
              <button type="button" className="btn_minus" onClick={(event) => countHandler(event, product.stock, product._id)} />
          }
              <input type="text" className="count_input" defaultValue={product.quantity} onKeyUp={(event) => countHandler(event, product.stock, product._id)}/>
              <button type="button" className="btn_plus" onClick={(event) => countHandler(event, product.stock, product._id)} />
          </span>
           EA
        </td>
        <td>
          $ {product.price}
        </td>
        <td>
          <button onClick={ () => props.removeItem(product._id)}>
            remove
          </button>
        </td>
      </tr>
    ))
  )

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Title</th>
              <th>Product Quantity</th>
              <th>Product Price</th>
              <th>Remove from Cart</th>
            </tr>
          </thead>
          <tbody>
            {renderItems()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserCardBlock;