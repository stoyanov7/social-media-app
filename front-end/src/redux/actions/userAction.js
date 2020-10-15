import { LOADING_UI, CLEAR_ERRORS, SET_USER, SET_ERRORS } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });

    axios
        .post('/login', userData)
        .then((res) => {
            const fbIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem('FBIdToken', fbIdToken);
            axios.defaults.headers.common['Authorization'] = fbIdToken;

            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch((err) => {
            dispatch({
               type: SET_ERRORS,
               payload: err.response.data
            });
        });
}

export const getUserData = () => (dispatch) => {
    axios
        .get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}