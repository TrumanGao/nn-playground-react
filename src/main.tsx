import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getDeviceType } from 'trumangao-utils';
import { MODE } from './constants/config';
import { getMock } from './utils/tools';
import './styles/base.less';
import './styles/vars.less';
import './styles/antd/index.less';
import App from './App.tsx';

async function initApp() {
  try {
    if (MODE !== 'PRODUCTION' && getDeviceType() !== 'desktop') {
      const VConsole = (await import('vconsole')).default;
      new VConsole();
    }

    if (MODE !== 'PRODUCTION') {
      console.log('mock数据: ', await getMock());
    }
  } catch (error) {
    console.error('项目初始化失败: ', error);
  } finally {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

initApp();
