import axios, { type AxiosResponse } from 'axios';
import { getStorage } from 'trumangao-utils';
import { Code, CodeMessage } from '@/constants/code';
import { MODE } from '@/constants/config';
import { getMock } from '@/utils/tools';

export interface ResponseData<D = unknown> {
  code: Code;
  message: string;
  success: boolean;
  data: D;
}

axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

axios.interceptors.request.use(
  async (config) => {
    const token =
      MODE === 'DEVELOPMENT'
        ? (await getMock())?.ticket_token
        : getStorage<string>('localStorage', 'HTTP_TOKEN');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    throw error;
  },
);

axios.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const { data, config } = response;

    if (
      data.code === Code.PERMISSION_NO_ACCESS ||
      data.code === Code.PERMISSION_NO_SUFFICIENT
    ) {
      console.error(`【${config.url}】接口：${CodeMessage[data.code]}`);
    }

    return response;
  },
  (error) => {
    throw error;
  },
);

export { axios as _axios };
