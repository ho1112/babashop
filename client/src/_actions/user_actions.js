import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(id){

    let body = {
        productId : id
    }

    const request = axios.post(`${USER_SERVER}/addToCart`, body)
    .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}

//cartPage
export function getCartItems(cartItems, userCart){

    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`) //복수의 상품을 가져와야한다
        .then(response => {
            //cartItem에 해당하는 정보들을 Product Collection에서 가져온 후
            //Quantity 정보를 넣어준다
            userCart.forEach(cartItem => {
                response.data.product.forEach((productDetail, index) => {
                    if(cartItem.id === productDetail._id) { //상품정보ID와 cart의 ID가 일치하면 cart.quantity를 넣어준다
                        response.data.product[index].quantity = cartItem.quantity
                    }

                })
            })
            return response.data;
        });

    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

