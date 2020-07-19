
import React, { useState, useEffect } from 'react';
//import moment from 'moment';
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie';

import PopUpView from './PopUpView';
import { COOKIE_VALUE } from './PopUpConstance'


function PopUpMain(props) {
    const [cookies, setCookies] = useState(props.cookies);
    const [hasCookies, setHasCookies] = useState(false);
    const [showPopUp, setShowPopUp] = useState(true);
    
    useEffect(() => {
        if (cookies) {
          const currentCookies = cookies.get(COOKIE_VALUE);
          //setShowPopUp(!currentCookies);
          setHasCookies(!!currentCookies);
        } else {
          setCookies(props.cookies)
        }
      }, [props.cookies, showPopUp]);
    

      const closePopUp = (selCheck) => {
          if (cookies) {
            console.log("X 클릭 cookies true");
            if (selCheck) {
                //const expires: moment().add(1, 'minutes').toDate();
                //console.log("X클릭 표시하지않음 체크 쿠키 갱신 시작");
                const date = new Date();
                const tomorrow = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()+1,
                  0,
                  0,
                  0,
                  0
                );
                //const expires = date.toUTCString();
                cookies.set(COOKIE_VALUE, true, { path: '/', expires:tomorrow });
            }
        }else{
            /*
            console.log("X 클릭 cookies false");
            console.log("X클릭 표시하지않음 체크 쿠키 생성 시작");
            const date = new Date();
            date.setTime(date.getTime() + 1);
            const expires = date.toUTCString();
            cookies.set(COOKIE_VALUE, true, { path: '/', maxAge:'3' });
            */
        }
    
        setShowPopUp(false);
      }
    
      const removeCookies = () => {
        if (cookies) {
          cookies.remove(COOKIE_VALUE);
        }
      }

    return (
      <div className="Main">
        {showPopUp && !hasCookies &&
        <PopUpView closePopUp={closePopUp} />
      }

      </div>
    )
  }
  
  export default withCookies(PopUpMain);