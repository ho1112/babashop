import React, { useState } from 'react';

function ProductQnA() {

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(3) //default image count:8

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

    const answerHandler = (event) => {

    }

  return (

    <div style={{marginLeft: '10%', marginRight: '10%'}}>
    <h1>商品Q&A {data.length}</h1>
    <br />
    <button>질문투고</button>
    <br />
    <hr />
    <div>
        {data.map( (item, index) => (
            <>
            <div onClick={answerHandler} key={index}>
                <div style={{display:'flex'}}>
                    <p>writer***</p>
                    <p>답변여부</p>
                </div>
                <p>{item.title}</p>
                <br />
                <div style={{display:'flex'}}>
                    <p>2020-07-26 12:00:00</p>
                </div>
            </div>    
            <hr />

            <div onClick={answerHandler}>
                <p>관리자로부터의 답변</p>
                <p>{item.title}</p>
                <br />
                    <p>2020-07-26 12:00:00</p>
                <hr />
            </div>
            </>

        ))}

    </div>
</div>
      
  );
}

export default ProductQnA;