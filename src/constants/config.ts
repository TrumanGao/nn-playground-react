/**
 * 运行环境
 * PRODUCTION: 线上; TESTING: 测试; DEVELOPMENT: 开发
 */
export const MODE = import.meta.env.MODE as
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'PRODUCTION';

const HTTP_BASEURL_MAP = {
  DEVELOPMENT: '/apiBase',
  TESTING: 'https://xxx.xx.com',
  PRODUCTION: 'https://xxx.xx.com',
};
export const HTTP_BASEURL = HTTP_BASEURL_MAP[MODE];
