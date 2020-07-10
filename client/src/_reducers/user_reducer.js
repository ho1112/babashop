import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            console.log("add");
            return {...state, 
                userData: {
                    ...state.userData,
                    cart: action.payload //routes/users.js/addToCart에서 send해준 userInfo.cart
                }
            }
        case GET_CART_ITEMS:
            return {...state, cartDetail: action.payload} //user_actions.js.getCartItems의 response.data
        case REMOVE_CART_ITEM:
            return {...state, cartDetail: action.payload.productInfo,
                    userData:{
                        ...state.userData,
                        cart: action.payload.cart
                    }} 
        case ON_SUCCESS_BUY:
            return {...state, cartDetail: action.payload.cartDetail,
                    userData:{
                        ...state.userData,
                         cart: action.payload.cart
                    }
            }         
        default:
            return state;
    }
}