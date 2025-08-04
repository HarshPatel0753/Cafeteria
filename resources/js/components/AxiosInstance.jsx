// import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';

const baseUrl = document.querySelector('meta').ownerDocument.location.origin;

const AxiosInstance = axios.create({
    baseURL: `${baseUrl}`,
});

AxiosInstance.interceptors.response.use(
    function(response){
        return response;
    },
    function(error) {
        return Promise.reject(error);
    },
);
// function (error) {
//     //         // 	if (config.withCredentials) {
//     //         //         // console.log(baseUrl);
//     //         // 		// config.baseURL = `${baseUrl}`;

//     //         // 		return config;
//     //         // 	}
//     if (error) {
//         console.log(1);
//         // return Promise.reject(error);
//     }
// }
// );

export default AxiosInstance;
