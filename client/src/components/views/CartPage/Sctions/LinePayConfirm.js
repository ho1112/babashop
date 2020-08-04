import React, { useEffect } from 'react';

function LinePayConfirm() {

    useEffect(() => {
        alert("결제가 완료 되었습니다.")
        //CartPage의 transactionSuccess처리를 여기서 실행해서
        //.then으로 카트페이지로 돌려보낸다.

        window.location.href= "user/cart"
    })

    return (
        <div>
        linePayConfirm
        </div>
    );
}

export default LinePayConfirm;