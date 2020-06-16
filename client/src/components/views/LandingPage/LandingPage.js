import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios"
import { Icon, Col, Card, Row, Carousel } from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import Checkbox from './Sections/CheckBox'
import { continents } from './Sections/Data' //checkBox item model


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8) //default image count:8
    const [PostSize, setPostSize] = useState()
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])
    
    const getProducts = (body) => {
        //상품정보 가져오기
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    if(body.loadMore) { //더보기일 경우
                        setProducts([...Products, ...response.data.productInfo]) //Products(기존 상품)+response(새로 가져온 상품)
                    } else {
                        setProducts(response.data.productInfo)
                    } 
                    setPostSize(response.data.postSize) //더보기할 상품이 남아있는지 상품 갯수를 넣어준다
                }else {
                    alert("failed Loading")
                }
            })
    }

    //더보기
    const loadMoreHandler = () => {
        let skip = Skip + Limit //기존 스킵+리미트
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(body)
        setSkip(skip)//스킵값 보존
    }

    //ant design - Carousel로 이미지 슬라이더 구현
    const renderCards = Products.map((product, index) =>{
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images}/>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })
    const showFilteredResults = (filters) => {
        let body = {
            skip: 0, //filter이기 때문에 0으로 초기화
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }
    const handleFilters = (filters, category) => {
        const newFilters = {...Filters} //현재 필터값 ex) { continents: [2], price: [3,4] }
        newFilters[category] = filters //새로 들어온 필터값[]을 해당 카테고리[]로 대체한다.
        showFilteredResults(newFilters)
    }


    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>takadanobaba shop</h2>
            </div>
            {/* filter */}

            {/* checkBox //continents -> Data.js(checkBox item model)*/}
            <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents") } /> 
            {/* radio */}


            {/* search */}

            {/* cards */}
            <Row>
                {renderCards}
            </Row>
        
            {PostSize >= Limit && /* 가져온 상품 갯수가 limit보다 크거나 같으면 더보기 버튼 표시 */
                <div style={{ display:'flex', justifyContent: 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
