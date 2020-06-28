import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0) {
            let images = []

            props.detail.images.map(item => { //images배열에 가져온 image경로를 넣어준다
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images);
        }
    }, [props.detail]) //props.detail값이 변하면 useEffect 라이프사이클이 돈다.

    return (
        <div>
            <ImageGallery items={Images}></ImageGallery>
        </div>
    );
}

export default ProductImage;