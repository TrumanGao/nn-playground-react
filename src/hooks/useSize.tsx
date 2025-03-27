import { useEffect } from 'react';
import { throttle } from 'lodash';
import { EventManager, getDeviceType } from 'trumangao-utils';
import { useAppStore } from '@/states';
const eventManager = new EventManager();

/**
 * @param options
 * @param options.throttleTime 监听屏幕变化节流时间，默认500ms
 * @param options.useContainer 是否使用容器，默认false
 * @param options.containerOptions 容器配置
 * @param options.containerOptions.aspectRatio 容器宽高比，默认1.33
 * @param options.containerOptions.minPadding 容器距离屏幕边缘的最小间距，默认12
 * @param options.useRem 是否使用rem，默认false
 * @param options.remOptions rem配置
 * @param options.remOptions.minSize rem最小值
 * @param options.remOptions.maxSize rem最大值
 */
export function useSize(
  options: {
    throttleTime?: number;
    useContainer?: boolean;
    containerOptions?: {
      aspectRatio: number;
      minPadding: number;
    };
    useRem?: boolean;
    remOptions?: {
      minSize?: number;
      maxSize?: number;
    };
  } = {},
) {
  const {
    throttleTime = 500,
    useContainer = false,
    containerOptions = {
      aspectRatio: 1.33,
      minPadding: 36,
    },
    useRem = false,
    remOptions,
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
      console.log('useSize - resize事件: ', {
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
    }, throttleTime);
    eventManager.addEventListener(
      'resize',
      () => throttledResize(),
      'window_resize_handleResize',
      window,
    );

    // 2. 处理屏幕方向变化
    eventManager.addEventListener(
      'change',
      () => {
        console.log('useSize - change事件: ', screen.orientation);
        updateScreenOrientation(screen.orientation);
      },
      'window_change_handleChange',
      window,
    );
    eventManager.addEventListener(
      'orientationchange',
      () => {
        console.log('useSize - orientationchange事件: ', screen.orientation);
        updateScreenOrientation(screen.orientation);
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
        'change',
        'window_change_handleChange',
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

  /**
   * 设置根节点字体大小
   */
  function handleRootFontSize(
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

    let rootFontSize =
      Math.min(windowSize.innerWidth, windowSize.innerHeight) / 10;

    if (remOptions?.minSize) {
      rootFontSize = Math.max(rootFontSize, remOptions.minSize);
    }
    if (remOptions?.maxSize) {
      rootFontSize = Math.min(rootFontSize, remOptions.maxSize);
    }

    document.documentElement.style.fontSize = `${rootFontSize}px`;
  }

  useEffect(() => {
    const deviceType = getDeviceType();
    console.log('useSize - 检测设备类型 deviceType: ', deviceType);
    // iphone 6 375 * 667
    // ipad mini 1024 * 768

    if (useContainer) {
      handleContainerSize({
        windowSize,
      });
    }

    if (useRem) {
      handleRootFontSize({
        windowSize,
      });
    }

    if (deviceType === 'mobile') {
      document.documentElement.style.setProperty('--text-size_18', '16px');
      document.documentElement.style.setProperty('--text-size_16', '14px');
      document.documentElement.style.setProperty('--text-size_14', '12px');
    } else {
      document.documentElement.style.setProperty('--text-size_18', '18px');
      document.documentElement.style.setProperty('--text-size_16', '16px');
      document.documentElement.style.setProperty('--text-size_14', '14px');
    }
  }, [windowSize, screenOrientation]);
}
