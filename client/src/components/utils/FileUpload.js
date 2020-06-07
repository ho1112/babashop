import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import axios from 'axios';

/**
 * react-dropzone lib
 * npm install react-dropzone --save
 */
function FileUpload() {
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
                    setImages([...Images, response.data.filePath ])
                } else {
                    alert('Failed to save file.');
                }
            })

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
                        <div key={index}>
                            <img style={{minWidth: '300px', width: '300px', height: '240px'}}
                                src={`http://localhost:5000/${image}`}
                            />
                        </div>    
                    ))}
            </div>
        </div>
    );
}

export default FileUpload;