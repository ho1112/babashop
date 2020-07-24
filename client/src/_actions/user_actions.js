import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY,
    UPDATE_CART_ITEM
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

export function addToCart(id, count){
    
    let body = {
        productId : id,
        count : count //선택수량
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
                response.data.forEach((productDetail, index) => {
                    if(cartItem.id === productDetail._id) { //상품정보ID와 cart의 ID가 일치하면 cart.quantity를 넣어준다
                        response.data[index].quantity = cartItem.quantity
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

// 카트 갱신
export function updateCartItem(productId, count){
    const request = axios.get(`/api/users/updateFromCart?id=${productId}&count=${count}`) 
        .then(response => {
            //productInfo, cart 정보를 조합해 CartDetail을 만든다.
            response.data.cart.forEach(item => {
                response.data.productInfo.forEach((product, index) => {
                    if(item.id === product._id){
                        response.data.productInfo[index].quantity = item.quantity
                    }
                })
            })
            return response.data;
        });

    return {
        type: UPDATE_CART_ITEM,
        payload: request
    }
}


export function removeCartItem(productId){
    const request = axios.get(`/api/users/removeFromCart?id=${productId}`) 
        .then(response => {
            //productInfo, cart 정보를 조합해 CartDetail을 만든다.
            response.data.cart.forEach(item => {
                response.data.productInfo.forEach((product, index) => {
                    if(item.id === product._id){
                        response.data.productInfo[index].quantity = item.quantity
                    }
                })
            })
            return response.data;
        });

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}

export function onSuccessBuy(data){

    const request = axios.post(`/api/users/successBuy`, data) 
        .then(response => response.data)

    return {
        type: ON_SUCCESS_BUY,
        payload: request
    }
}

