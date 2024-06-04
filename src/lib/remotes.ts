import { LoginResponse, LoginVariables } from '../types';
import { http } from '../utils/http';

export function login(data: LoginVariables) {
    return http.post<LoginVariables, LoginResponse>('/auth/login', data)
}