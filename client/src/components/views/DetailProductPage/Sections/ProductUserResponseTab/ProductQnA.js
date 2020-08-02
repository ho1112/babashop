import React, { useState, useEffect } from 'react';
import ProductUserQnAModal from './ProductUserQnAModal'

function ProductQnA(props) {

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(3) //default image count:8
    const [showQnAModal, setshowQnAModal] = useState(false);
    const [qnaList, setQnaList] = useState([]);
    const [showAdminAnswer, setShowAdminAnswer] = useState("");

    useEffect(() =>{
      //Axios
      if(props.detail && props.detail.qna){
        let qnas = [];
        props.detail.qna.map( item => {
          let date = new Date(item.date);
          let month = props.getZero(date.getMonth()+1);
          let day = props.getZero(date.getDate());
          let hours = props.getZero(date.getHours());
          let min = props.getZero(date.getMinutes())
          let adminDate = new Date(item.adminAnswerDate);
          let aMM = props.getZero(adminDate.getMonth()+1);
          let add = props.getZero(adminDate.getDate());
          let ahh = props.getZero(adminDate.getHours());
          let amm = props.getZero(adminDate.getMinutes())
          qnas.push({
            writer: item.writer,
            qna: item.qna,
            date: `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${date.getSeconds()}`,
            adminAnswer: item.adminAnswer,
            adminAnswerDate: `${adminDate.getFullYear()}-${aMM}-${add} ${ahh}:${amm}:${adminDate.getSeconds()}`,
            public: item.public
          })
        })
        setQnaList(qnas)
        console.log(qnas.length)
      }
    },[props.detail])

    const showAdminAnswerToggle = (item) => {
      showAdminAnswer === item.date+item.writer ?
      setShowAdminAnswer("")
      :
      setShowAdminAnswer(item.date+item.writer)
    }

    //더보기
    const loadMoreHandler = () => {
        let skip = Skip + Limit //기존 스킵+리미트
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        //getProducts(body)
        setSkip(skip)//스킵값 보존
    }

    const answerHandler = () => {
      console.log("ok")
      setshowQnAModal(false);
    }

    const inputQna = () => {
      setshowQnAModal(true);
    }

    const showQnACancel = (event) => {
      if(event.target.className === "popup-layer" || event.target.className === "btn_close"){
          setshowQnAModal(false);
      }
    }

    //질문 등록 후 새로고침
    const qnaRefresh = (newQna) => {
      let qnas = [];
      newQna.qna.map( item => {
        let date = new Date(item.date);
        let month = props.getZero(date.getMonth()+1);
        let day = props.getZero(date.getDate());
        let hours = props.getZero(date.getHours());
        let min = props.getZero(date.getMinutes())
        let adminDate = new Date(item.adminAnswerDate);
        let aMM = props.getZero(adminDate.getMonth()+1);
        let add = props.getZero(adminDate.getDate());
        let ahh = props.getZero(adminDate.getHours());
        let amm = props.getZero(adminDate.getMinutes())
        qnas.push({
          writer: item.writer,
          qna: item.qna,
          date: `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${date.getSeconds()}`,
          adminAnswer: item.adminAnswer,
          adminAnswerDate: `${adminDate.getFullYear()}-${aMM}-${add} ${ahh}:${amm}:${adminDate.getSeconds()}`,
          public: item.public
        })
      })
      setQnaList(qnas)
      setshowQnAModal(false);
    }

  return (

    <div style={{marginLeft: '10%', marginRight: '10%'}}>
    <h1>商品Q&A {qnaList.length}</h1>
    <br />
    <button onClick={inputQna}>질문투고</button>
    <br />
    <hr />
    <div>
        {qnaList && qnaList.map( (item, index) => (
          <>
            <div onClick={ ()=> showAdminAnswerToggle(item) } key={index} >
                <div style={{display:'flex'}}>
                  <p>{item.writer}</p>
                </div>
                    {item.public === "private" ?
                    <p>"비밀글 입니다.</p>
                    :
                    <pre>{item.qna}</pre>
                    }
                    {item.adminAnswer ?
                    <p>答え済み</p>
                    : null
                    }
                <br />
                <div style={{display:'flex'}}>
                    <p>{item.date}</p>
                </div>
            </div>    
            <hr style={{margin:0}} />
            {item.adminAnswer && showAdminAnswer == item.date+item.writer ?
              <div style={{backgroundColor:"#ebebeb"}} onClick={ ()=> showAdminAnswerToggle(item) } >
                  <p>※관리자로부터의 답변</p>
                  <pre>{item.adminAnswer}</pre>
                  <br />
                  <p>2020-07-26 12:00:00</p>
                  <hr />
              </div>
              : null
            }
            </>
        ))} 
    </div>

    {showQnAModal &&
      <ProductUserQnAModal detail={props.detail} cancel={showQnACancel} submit={qnaRefresh}/>
    }

</div>
      
  );
}

export default ProductQnA;