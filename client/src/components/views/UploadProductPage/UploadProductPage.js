import React, { useState } from 'react';
import { Typography, Button, Form, Input, InputNumber  } from 'antd'; 
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

/**
 * Upload Page
 */

//const { Title } = Typography;
const { TextArea } = Input;
//select box Item
const Continents = [
  {key: 1, value: "Afica" },
  {key: 2, value: "Europe" },
  {key: 3, value: "Asia" },
  {key: 4, value: "North America" },
  {key: 5, value: "South America" },
  {key: 6, value: "Australia" },
  {key: 7, value: "Antarctica" }
];

function UploadProductPage(props) {
//useState
  const [ Title, setTitle ] = useState("")
  const [ Description, setDescription ] = useState("")
  const [ Price, setPrice ] = useState(0)
  const [ Stock, setStock ] = useState(0)
  const [ Continent, setContinent ] = useState(1)
  const [ Images, setImages ] = useState([])
//event handler
  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }
  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }
  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }
  const stockChangeHandler = (event) => {
    setStock(event)
  }
  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value)
  }

  //
  const updateImages = (newImages) => {
    setImages(newImages)
  }
  //
  const submitHandler = (event) => {
    event.preventDefault();
    //validation check
    if(!Title || !Description || !Price || !Continent || !Images ) {
      return alert("Please enter all entries.")
    }
    //submit -> server
    const body = {
      writer: props.user.userData._id, //from auth.js
      title: Title,
      description: Description,
      price: Price,
      stock: Stock,
      continent : Continent,
      images: Images
    }
    console.log("uploadPage : "+Images[0].size  )

    Axios.post("/api/product", body)
        .then(response => {
          if(response.data.success) {
            alert("success upload");
            props.history.push('/') 
          } else {
            alert("failed upload");
            console.log(response.data.err);
          }
        })

  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 level={2}>여행 상품 업로드</h2>
      </div>

      <Form onSubmit= {submitHandler}>
        {/*drop zone*/}
        <FileUpload refreshFunction = {updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input onChange={ titleChangeHandler } value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={ descriptionChangeHandler } value={Description}/>
        <br />
        <br />
        <label>가격</label>
        <Input onChange={ priceChangeHandler } value={Price}/>
        <br />
        <br />
        <label>재고</label>
        <br />
        <InputNumber min={1} max={10000} defaultValue={Stock} onChange={stockChangeHandler} value={Stock}/>
        <br />
        <br />
        <select onChange={ continentChangeHandler } >
          {Continents.map(item => (
            <option key={item.key} value={item.key} >{item.value}</option>
          ))}
        </select>
        <br />
        <br />
        <Button onClick={submitHandler}> 
            확인
        </Button>

      </Form>  
    </div>
  )
}

export default UploadProductPage;