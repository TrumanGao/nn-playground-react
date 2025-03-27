import { useEffect, useRef } from 'react';
import { ConfigProvider, message } from 'antd';
import type { ComponentToken } from 'antd/es/message/style';
import type {
  ConfigOptions,
  ArgsProps,
  MessageInstance,
} from 'antd/es/message/interface';
import '@/styles/antd/message.less';

export const useMyMessage = (config?: ConfigOptions) => {
  const _config = {
    maxCount: 1,
    duration: 1.5,
    prefixCls: 'my-message',
    ...config,
  };
  const [messageInstance, contextHolder] = message.useMessage(_config);

  const destroyTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (destroyTimer.current) {
        clearTimeout(destroyTimer.current);
      }
    };
  }, []);

  function myMessage(options: ArgsProps) {
    myMessageDestroy(messageInstance);
    messageInstance.open(options);

    const _duration = options.duration || _config.duration;
    if (destroyTimer.current) {
      clearTimeout(destroyTimer.current);
    }
    destroyTimer.current = setTimeout(() => {
      myMessageDestroy(messageInstance);
    }, _duration * 1000);
  }

  function myMessageDestroy(instance: MessageInstance) {
    console.log('myMessageDestroy');
    instance?.destroy();
    // 手动移除所有子节点，用于兼容低版本浏览器
    const myMessageEls = document.querySelectorAll('.my-message');
    Array.prototype.map.call(myMessageEls, (el) => {
      if (el?.children?.length) {
        el.innerHTML = '';
      }
    });
  }

  function myMessageContextHolder(messageToken?: Partial<ComponentToken>) {
    return (
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentBg: 'rgba(0, 0, 0, 0.6)',
              contentPadding: '8px 16px',
              colorText: '#ffffff',
              borderRadiusLG: 19,
              ...messageToken,
            },
          },
        }}
      >
        {contextHolder}
      </ConfigProvider>
    );
  }

  return {
    messageInstance,
    myMessage,
    myMessageDestroy,
    myMessageContextHolder,
  };
};
