import React, { useState } from 'react';

import './PopUpView.css';

function PopUpView(props) {
  const [selCheck, setSelCheck] = useState(false);

  const onClosePopUp = () => {
    props.closePopUp(selCheck);
  }

  const onCheck = () => {
    setSelCheck(!selCheck);
    //console.log("popupView, oncheck "+!selCheck);
  }

  return (

    <div class="MdLYR01Box mdLYR01Cashback" data-widget="ModalWindow" data-widget-id="ModalWindowCashBack" >
      <div class="MdLYR02Body mdLYR02Cashback" >
        <a class="mdLYR02Close FnModalWindowClose" href="javascript:;" onClick={onClosePopUp} ><span class="MdBtnClose01">닫기</span></a>

        <div class="MdLYR18Cashback mdLYR18TypeImg">

          <h2 class="mdLYR18Ttl01 MdNonDisp">
            <span class="mdLYR18TtlTxt">Get back Credit with each</span>LINE STORE purchase!
          </h2>

          <h2 class="mdLYR18Ttl01">
            <img src="https://obs.line-scdn.net/0hklB_x-qONEN_JhziOQ1LFFVkLy0RQm1GEx8kcRk4ayFUEXUXEEQud14mY3RXQ3FFShIsJQ9zOCdTQXoTShN7LVkvaHpUFTYUEUF4I1khOA" alt="Get back Credit with each LINE STORE purchase!" width="960" height="150" />
          </h2>

          <div class="mdLYR18Copy01">최대 1%까지 LINE 크레딧 적립</div>

          <p class="mdLYR18Desc01">대상 상품 및 예외 사항에 대한 자세한 내용을 확인하려면 '자세히 보기'를 누르세요.</p>

          <div class="mdLYR18Txt01">

            <label>
              <div id="cashBackPopupCheck" class="mdLYR18Check01">
                <span class="mdLYR18Check01Ico"></span>
                <input type="checkbox" id="cashBackPopupCheckBox" onChange={onCheck} />
              </div>
                오늘 하루 열지 않기
              </label>
          </div>
          <div class="mdLYR18Btn">
            <a href="/creditback/ko">자세히 보기</a>
          </div>

        </div>
      </div>
    </div>

  )
}

export default PopUpView;