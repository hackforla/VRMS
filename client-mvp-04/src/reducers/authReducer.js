import { LOGIN } from '../actions/types';

const authDefaultState = {
    loggedIn : false
}


export default (state = authDefaultState, {type, payload}) => {
    switch (type) {
        case LOGIN:
            return {
                ...state,
                loggedIn : true
            }
        default:
            return state;
    }
}
