import React, { useState, useEffect } from 'react';
import ProductUserQnAModal from './ProductUserQnAModal'

function ProductQnA(props) {

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(3) //default image count:8
    const [showQnAModal, setshowQnAModal] = useState(false);
    const [qnaList, setQnaList] = useState([]);

    useEffect(() =>{
      //Axios
  
      if(props.detail && props.detail.qna){
        let qnas = [];
        props.detail.qna.map( item => {
          let date = new Date(item.date).toString();
          let adminDate = new Date(item.adminAnswerDate).toString();
          qnas.push({
            writer: item.writer,
            qna: item.qna,
            date: date,
            adminAnswer: item.adminAnswer,
            adminAnswerDate: adminDate,
            public: item.public
          })
        })
        setQnaList(qnas)
        console.log(qnas.length)
      }
    },[props.detail])

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

    const data = [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
      ];

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
      //console.log("reviewRefresh : "+ props.detail.review[0].rate)
      console.log("qnaRefresh"+newQna)
      let qnas = [];
      newQna.qna.map( item => {
        let date = new Date(item.date).toString();
        let adminDate = new Date(item.adminAnswerDate).toString();
        qnas.push({
          writer: item.writer,
          qna: item.qna,
          date: date,
          adminAnswer: item.adminAnswer,
          adminAnswerDate: adminDate,
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
            <div onClick={answerHandler} key={index}>
                <div style={{display:'flex'}}>
                    <p>{item.writer}</p>
                    <p>답변여부</p>
                </div>
                <pre>{item.qna}</pre>
                <br />
                <div style={{display:'flex'}}>
                    <p>{item.date}</p>
                </div>
            </div>    
            <hr />

            <div onClick={answerHandler}>
                <p>관리자로부터의 답변</p>
                <pre>{item.adminAnswer}</pre>
                <br />
                    <p>2020-07-26 12:00:00</p>
                <hr />
            </div>
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