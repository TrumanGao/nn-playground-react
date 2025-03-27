import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import { HTTP_BASEURL } from '@/constants/config';
import { _axios, ResponseData } from '.';

/**
 * 新增用户
 */
export const postUser = (
  data: Omit<UserInfo, 'id'>,
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse<ResponseData<UserInfo>>> =>
  _axios.post('/xxx/api/user', data, {
    baseURL: HTTP_BASEURL,
    ...config,
  });

/**
 * 删除用户
 */
export const deleteUser = (
  id: number,
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse<ResponseData<boolean>>> =>
  _axios.delete(`/xxx/api/user/${id}`, {
    baseURL: HTTP_BASEURL,
    ...config,
  });

/**
 * 修改用户信息
 */
export const putUserInfo = (
  data: UserInfo,
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse<ResponseData<UserInfo>>> =>
  _axios.put('/xxx/api/user/info', data, {
    baseURL: HTTP_BASEURL,
    ...config,
  });

/**
 * 查询用户信息
 */
export const getUserInfo = (
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse<ResponseData<UserInfo>>> =>
  _axios.get('/xxx/api/user/info', {
    baseURL: HTTP_BASEURL,
    ...config,
  });
