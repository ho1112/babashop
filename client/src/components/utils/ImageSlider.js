import React from 'react';
import { Icon, Col, Card, Row, Carousel } from 'antd'

function ImageSlider(props) {
  //ant design - Carousel로 이미지 슬라이더 구현
  return (
    <div>
        <Carousel autoplay> 
            {props.images.map((image, index) => (
                <div key={index}>
                    <img style={{ width:'100%', maxHeight:'150px'}}
                        src={`${image}`}  />
                </div>
            ))}
        </Carousel>
    </div>
  )
}

export default ImageSlider;