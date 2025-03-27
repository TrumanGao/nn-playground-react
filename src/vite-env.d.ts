/// <reference types="vite/client" />

declare const __DEVELOPER__: string | undefined;

declare interface Mock {
  name: string;
  ticket_token?: string;
}

declare interface UserInfo {
  userId: number;
  userName: string;
}
