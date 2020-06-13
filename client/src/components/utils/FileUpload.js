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

    //multer Definition
    const dropHandler = (files) => {
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
                                src={`http://localhost:5000/${image}`} alt='preview'
                            />
                        </div>    
                    ))}
            </div>
        </div>
    );
}

export default FileUpload;