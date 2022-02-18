import axios from 'axios';
import store from './store';
import { load_user, load_profile } from './actions';

// export function refresh_token(){}

export function setup_user_and_profile() {
    axios.get('api/me/', {headers: {Authorization: ` Bearer ${JSON.parse(localStorage.getItem('AuthToken')).access}`}})
    .then(response => {
        store.dispatch(load_user(response.data.user));
        store.dispatch(load_profile(response.data.profile));
    })
    .catch(err => {
        console.log(err)
    })
}