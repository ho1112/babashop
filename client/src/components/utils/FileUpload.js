import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import axios from 'axios';

/**
 * react-dropzone lib
 * npm install react-dropzone --save
 */
function FileUpload(props) {
    const [Images, setImages] = useState([]);

    const [imageBase64, setImageBase64] = useState([]); // 파일 base64 미리보기 파일 url

    //multer Definition (X)
    const dropHandler = (files) => {
    //새로운 이미지 미리보기 처리
    let reader = new FileReader();
    reader.onloadend = () => {
      // 2. 읽기가 완료되면 reander에서 base64을 읽어 state에 넣어준다.
      const base64 = reader.result;
      if (base64) {
        files[0].base64 = base64.toString();
        //setImageBase64([...imageBase64, base64.toString()]); // 파일 base64 상태 업데이트
        setImages([...Images, files[0]]); // 파일 상태 업데이트
        props.refreshFunction([...Images, files[0] ]) //UploadProductPage update state 부모페이지 state에 전달
      }
    }
    
    if (files[0]) {
      reader.readAsDataURL(files[0]); // 1. 파일을 읽어 버퍼에 저장.
    }

        // 기존방식 (multer업로드 후 로컬주소 삽입방식)
        /*
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'} //multer type == multipart/form-data
        }
        formData.append("file", files[0]);
        //axios -> multer data sending
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...Images, response.data.filePath ]) //update state
                    props.refreshFunction([...Images, response.data.filePath ]) //UploadProductPage update state
                } else {
                    alert('Failed to save file.');
                }
            })
    */
    }

    //image delete
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        newImages.splice(currentIndex, 1) // delete 1 item
        setImages(newImages) //request update state

        props.refreshFunction( newImages ) //UploadProductPage update state
    }

    return (
        <div style={{ display:'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={ dropHandler }>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div style={{ width: 300, height:240, border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
                        {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type='plus' style={{ fontSize: '3rem'}} />
                        </div>
                    </section>
                )}
            </Dropzone>
            <div style={{display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                    {Images.map((image, index) => (
                        //preview zone
                        <div onClick={()=> deleteHandler(image)} key={index}>
                            <img style={{minWidth: '300px', width: '300px', height: '240px'}}
                                //src={`http://localhost:5000/${image}`} 
                                src={`${image.base64}`}
                                alt='preview'
                            />
                        </div>    
                    ))}
            </div>
        </div>
    );
}

export default FileUpload;