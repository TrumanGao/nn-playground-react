import { type StateCreator } from 'zustand';

export interface UserSlice {
  userInfo?: UserInfo;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  userInfo: undefined,
  updateUserInfo: (info: UserInfo) =>
    set((state) => {
      {
        state.userInfo = info;
        return state;
      }
    }),
});
