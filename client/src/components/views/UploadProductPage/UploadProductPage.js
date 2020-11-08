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
  {key: 1, value: "アウター" },
  {key: 2, value: "トップス" },
  {key: 3, value: "ボトムス" },
  {key: 4, value: "シューズ" },
  {key: 5, value: "バッグ" },
  {key: 6, value: "アクセサリー" },
  {key: 7, value: "香水" }
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
      continents : Continent,
      images: Images
    }
    console.log("uploadPage : "+Images[0].size + " Continent : "+Continent  )
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
        <h2 level={2}>商品アップロード</h2>
      </div>

      <Form onSubmit= {submitHandler}>
        {/*drop zone*/}
        <FileUpload refreshFunction = {updateImages} />
        <br />
        <br />
        <label>名称</label>
        <Input onChange={ titleChangeHandler } value={Title} />
        <br />
        <br />
        <label>説明</label>
        <TextArea onChange={ descriptionChangeHandler } value={Description}/>
        <br />
        <br />
        <label>値段</label>
        <Input onChange={ priceChangeHandler } value={Price}/>
        <br />
        <br />
        <label>在庫</label>
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
            Submit
        </Button>

      </Form>  
    </div>
  )
}

export default UploadProductPage;