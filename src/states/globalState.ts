import { type StateCreator } from 'zustand';

const InitialVisibleMap = {
  confirmModal: false,
};

export interface globalSlice {
  visibleMap: typeof InitialVisibleMap;
  updateVisible: (options: {
    [key in keyof globalSlice['visibleMap']]: boolean;
  }) => void;
  screenOrientation: ScreenOrientation;
  updateScreenOrientation: (orientation: ScreenOrientation) => void;
  windowSize: {
    innerWidth: number;
    innerHeight: number;
  };
  updateWindowSize: (size: { innerWidth: number; innerHeight: number }) => void;
  /**
   * 容器尺寸
   */
  containerSize: {
    width: number;
    height: number;
  };
  /**
   * 设置容器尺寸
   */
  updateContainerSize: (size: { width: number; height: number }) => void;
}

export const createGlobalSlice: StateCreator<
  globalSlice,
  [],
  [],
  globalSlice
> = (set) => ({
  visibleMap: InitialVisibleMap,
  updateVisible(options) {
    set((state) => {
      state.visibleMap = {
        ...state.visibleMap,
        ...options,
      };
      return state;
    });
  },
  screenOrientation: screen.orientation,
  updateScreenOrientation(orientation) {
    set((state) => {
      state.screenOrientation = orientation;
      console.log('globalState - updateScreenOrientation: ', orientation);
      return state;
    });
  },
  windowSize: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  },
  updateWindowSize(size) {
    set((state) => {
      state.windowSize = size;
      console.log('globalState - updateWindowSize: ', size);
      return state;
    });
  },
  containerSize: {
    width: 0,
    height: 0,
  },
  updateContainerSize(size) {
    set((state) => {
      state.containerSize = size;
      console.log('globalState - updateContainerSize: ', size);
      return state;
    });
  },
});
