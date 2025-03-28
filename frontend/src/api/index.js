import axios from 'axios';
import { useLoadingStore } from '../stores/loadingStore';

// 기본 axios 인스턴스 설정
const api = axios.create();

// 요청 인터셉터
api.interceptors.request.use((config) => {
    useLoadingStore.getState().setIsLoading(true);
    return config;
});

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
        useLoadingStore.getState().setIsLoading(false);
        return response;
    },
    (error) => {
        useLoadingStore.getState().setIsLoading(false);
        return Promise.reject(error);
    }
);

export default api; 