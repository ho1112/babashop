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
        <a class="mdLYR02Close FnModalWindowClose" href="javascript:;" onClick={onClosePopUp} ><span class="MdBtnClose01"></span></a>

        <div class="MdLYR18Cashback mdLYR18TypeImg">

          <h2 class="mdLYR18Ttl01 MdNonDisp">
            <span class="mdLYR18TtlTxt">Get back Credit with each</span>STORE purchase!
          </h2>

          <h2 class="mdLYR18Ttl01">
            <img src="" alt="Get back Credit with each STORE purchase!" width="960" height="150" />
          </h2>

          <div class="mdLYR18Copy01">最大1%までポイント還元</div>

          <p class="mdLYR18Desc01">詳しくは商品ページをご確認ください。</p>

          <div class="mdLYR18Txt01">

            <label>
              <div id="cashBackPopupCheck" class="mdLYR18Check01">
                <span class="mdLYR18Check01Ico"></span>
                <input type="checkbox" id="cashBackPopupCheckBox" onChange={onCheck} />
              </div>
                今日は表示しない
              </label>
          </div>
          <div class="mdLYR18Btn">
            <a href="javascript:void(0)" onClick={onClosePopUp}>Close</a>
          </div>

        </div>
      </div>
    </div>

  )
}

export default PopUpView;