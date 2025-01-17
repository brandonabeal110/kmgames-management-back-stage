import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/multiTags";
import { removeStorage, sessionKey, TokenKey } from "@/utils/auth";

export const useUserStore = defineStore('USERSTATE', {
  state: (): userType => ({
    roles: [],
    userInfo: {} as UserAPI.LoginData,
    token: '',
  }),
  actions: {
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    async loginByUsername(_data) {
    },
    logOut() {
      this.roles = [];
      removeStorage();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      this.userInfo = {};
      window.location.reload();
    },
    async signOut() {
      API.loginOut({
        id: this.userInfo.id as number,
        name: this.userInfo.name
      })
    },
    setUserInfo(_: UserAPI.LoginData) {
      this.userInfo = Object.assign(this.userInfo, _)
      this.token = _.token;
      storageSession().setItem(sessionKey, this.userInfo);
      storageSession().setItem(TokenKey, this.token);
    },
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage }
    ]
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
