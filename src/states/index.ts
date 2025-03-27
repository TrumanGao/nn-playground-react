import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { globalSlice, createGlobalSlice } from './globalState';
import { UserSlice, createUserSlice } from './userState';

export const useAppStore = create<globalSlice & UserSlice>()(
  immer((...a) => ({
    ...createGlobalSlice(...a),
    ...createUserSlice(...a),
  })),
);

export * from './globalState';
export * from './userState';
