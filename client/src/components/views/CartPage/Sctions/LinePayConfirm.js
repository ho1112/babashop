import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Result } from 'antd'

function LinePayConfirm(props) {

    useEffect(() => {
        alert("결제가 완료 되었습니다.")
        window.location.href= "user/cart"
    })
 

    return (
      <Result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
    />
    );
}

export default LinePayConfirm;