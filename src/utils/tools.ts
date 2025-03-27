import { MODE } from '@/constants/config';

/**
 * 仅在开发环境和测试环境下使用
 */
export const getMock = async () => {
  let mock: Mock | undefined;
  try {
    switch (MODE) {
      case 'DEVELOPMENT':
        if (typeof __DEVELOPER__ !== 'undefined') {
          mock = (await import(`@/mock/${__DEVELOPER__}.ts`)).mock;
        }
        break;
      case 'TESTING':
        mock = (await import('@/mock/default.ts')).mock;
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('获取 mock 数据失败: ', error);
  }

  return mock;
};
