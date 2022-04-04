import axios from 'axios'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { set_tokens, logout_user, remove_user, remove_tokens, add_toast } from '../actions';

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
        
            const response = await axios.post(`/api/v1/token/refresh/`, {
                refresh: authTokens.refresh
            }).catch(err => {
                if (err.response.status === 401) {
                    dispatch(remove_user());
                    dispatch(remove_tokens());
                    dispatch(logout_user());
                    dispatch(add_toast({
                        page: "Logout",
                        content: `You logged out successfully.`,
                        bg: "success",
                        text: "text-white"
                    }));
                }
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