import axios from 'axios'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { set_tokens } from '../actions';

// const baseURL = 'http://127.0.0.1:8000'
function useAxios({includeTokens= true} = {}) {

    const dispatch = useDispatch();
    const { authTokens } = useSelector(state => state);

    const axiosInstance = axios.create({
        // baseURL,
        headers: {
            "Content-Type": 'application/json'
        }
    });

    if (includeTokens) {
        axiosInstance.interceptors.request.use(async req => {
        
            const accessToken = jwt_decode(authTokens.access)
            const isExpired = dayjs.unix(accessToken.exp).diff(dayjs()) < 1;
        
            if(!isExpired) {
                req.headers.Authorization = `Bearer ${authTokens.access}`
                return req
            }
        
            const response = await axios.post(`/api/token/refresh/`, {
                refresh: authTokens.refresh
            });
        
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            
            dispatch(set_tokens(response.data))
            
            req.headers.Authorization = `Bearer ${response.data.access}`
            return req
        })
    }
    
    return axiosInstance
}

export default useAxios;