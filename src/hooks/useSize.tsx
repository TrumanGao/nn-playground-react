import { useEffect } from 'react';
import { throttle } from 'lodash';
import { EventManager, getDeviceType } from 'trumangao-utils';
import { useAppStore } from '@/states';
const eventManager = new EventManager();

/**
 * @param options
 * @param options.resizeCallback resize事件的回调函数
 * @param options.orientationChangeCallback orientationchange事件的回调函数
 * @param options.throttleTime 监听屏幕变化节流时间，默认500ms
 * @param options.useContainer 是否使用容器，默认false
 * @param options.containerOptions 容器配置
 * @param options.containerOptions.aspectRatio 容器宽高比，默认1.33
 * @param options.containerOptions.minPadding 容器距离屏幕边缘的最小间距，默认12
 */
export function useSize(
  options: {
    resizeCallback?: (windowSize: {
      innerWidth: number;
      innerHeight: number;
    }) => void;
    orientationChangeCallback?: (orientation: ScreenOrientation) => void;
    throttleTime?: number;
    useContainer?: boolean;
    containerOptions?: {
      aspectRatio: number;
      minPadding: number;
    };
  } = {},
) {
  const {
    resizeCallback,
    orientationChangeCallback,
    throttleTime = 500,
    useContainer = false,
    containerOptions = {
      aspectRatio: 1.33,
      minPadding: 36,
    },
  } = options;

  const {
    screenOrientation,
    updateScreenOrientation,
    windowSize,
    updateWindowSize,
    updateContainerSize,
  } = useAppStore();

  /**
   * 监听屏幕尺寸和方向变化
   */
  useEffect(() => {
    // 1. 处理屏幕尺寸变化
    const throttledResize = throttle(() => {
      console.log('useSize - resize: ', {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
      updateWindowSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
      document.documentElement.style.setProperty(
        '--window-height',
        `${window.innerHeight}px`,
      );
      resizeCallback?.call(null, {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }, throttleTime);
    eventManager.addEventListener(
      'resize',
      () => throttledResize(),
      'window_resize_handleResize',
      window,
    );

    // 2. 处理屏幕方向变化
    eventManager.addEventListener(
      'orientationchange',
      () => {
        console.log('useSize - orientationchange: ', screen.orientation);
        updateScreenOrientation(screen.orientation);
        orientationChangeCallback?.call(null, screen.orientation);
      },
      'window_orientationchange_handleOrientationchange',
      window,
    );

    return () => {
      eventManager.removeEventListener(
        'resize',
        'window_resize_handleResize',
        window,
      );
      eventManager.removeEventListener(
        'orientationchange',
        'window_orientationchange_handleOrientationchange',
        window,
      );
    };
  }, []);

  /**
   * 设置容器尺寸
   */
  function handleContainerSize(
    options: {
      windowSize?: { innerWidth: number; innerHeight: number };
    } = {},
  ) {
    const {
      windowSize = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    } = options;

    if (
      windowSize.innerWidth / windowSize.innerHeight >
      containerOptions.aspectRatio
    ) {
      // 横屏
      const limitedHeight = Math.max(
        windowSize.innerHeight - containerOptions.minPadding * 2,
        375,
      );
      updateContainerSize({
        width: limitedHeight * containerOptions.aspectRatio,
        height: limitedHeight,
      });
    } else {
      // 竖屏
      const limitedWidth = Math.max(
        windowSize.innerWidth - containerOptions.minPadding * 2,
        375 * containerOptions.aspectRatio,
      );
      updateContainerSize({
        width: limitedWidth,
        height: limitedWidth / containerOptions.aspectRatio,
      });
    }
  }

  useEffect(() => {
    const deviceType = getDeviceType();
    console.log('useSize - deviceType: ', deviceType);
    // iphone 6 375 * 667
    // ipad mini 1024 * 768

    if (useContainer) {
      handleContainerSize({
        windowSize,
      });
    }

    if (deviceType === 'mobile') {
      document.documentElement.style.setProperty('--text-size', '14px');
      document.documentElement.style.setProperty('--text-size_small', '12px');
      document.documentElement.style.setProperty('--text-size_large', '16px');
    } else {
      document.documentElement.style.setProperty('--text-size', '16px');
      document.documentElement.style.setProperty('--text-size_small', '14px');
      document.documentElement.style.setProperty('--text-size_large', '18px');
    }
  }, [windowSize, screenOrientation]);
}
