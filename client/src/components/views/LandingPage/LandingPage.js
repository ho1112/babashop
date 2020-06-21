import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios"
import { Icon, Col, Card, Row, Carousel } from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import Checkbox from './Sections/CheckBox'
import Radiobox from './Sections/RadioBox'
import SearchFeature from './Sections/SearchFeature'
import { continents, price } from './Sections/Data' //checkBox item model


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8) //default image count:8
    const [PostSize, setPostSize] = useState()
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

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
    const showFilteredResults = (filters) => { //DB에 filters값을 전달해 해당하는 상품을 가져온다
        let body = {
            skip: 0, //filter이기 때문에 0으로 초기화
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price; //Data.js
        let array = [];
        for(let key in data) {
            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array; //선택한 라디오 객체의"array"(Data.js)를 let array에 넣어준다 
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters} //현재 필터값 ex) { continents: [2], price: [3,4] }
        newFilters[category] = filters //새로 들어온 필터값[]을 해당 카테고리[]로 대체한다.
        if(category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters) //새로운 검색조건을 useState에 넣어준다.
    }

    //검색기능 - SearchFeature.js에서 받아온 값을 useState에 갱신
    const updateSearchTerm = (newSearchTerm) => { //newSearchTerm(SearchFeature.js에서 보낸 event.target.value)
        let body = {
            skip: 0, //검색이기 때문에 0으로 초기화
            limit: Limit,
            filters: Filters, //현재 useState값(체크,라디오)
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }


    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>takadanobaba shop</h2>
            </div>
            {/* filter */}

            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    {/* checkBox //continents -> Data.js(checkBox item model)*/}
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents") } /> 
                </Col>
                <Col lg={12} xs={24}>
                    {/* radio */}
                    <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price") }/>
                </Col>
            </Row>


            {/* search */}
            <div style={{ display:'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>
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
