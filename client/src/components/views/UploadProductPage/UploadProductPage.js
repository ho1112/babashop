import React, { useState } from 'react';
import { Typography, Button, Form, Input } from 'antd'; 

/**
 * Upload Page
 */

//const { Title } = Typography;
const { TextArea } = Input;

function UploadProductPage() {

  const [ Title, setTitle ] = useState("")
  const [ Description, setDescription ] = useState("")
  const [ Price, setPrice ] = useState(0)
  const [ Continent, setContinent ] = useState(1)
  const [ Images, setImages ] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }
  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }
  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 level={2}>여행 상품 업로드</h2>
      </div>

      <Form>

        {/*drop zone*/}
        <br />
        <br />
        <label>이동</label>
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
        <select>
          <option></option>
        </select>
        <br />
        <br />
        <Button>

        </Button>

      </Form>  
    </div>
  )
}

export default UploadProductPage;