// oauth.ts
import { createId } from "../db/utils";
import { type OAuthConfig, type UserInfo, OAuthProvider } from "./providers/base";
import github from "./providers/github";
import google from "./providers/google";
import microsoft from "./providers/microsoft";

const providers = {
  github,
  google,
  microsoft
};

export type Providers = typeof providers;

export class OAuth {
  private provider: OAuthProvider;
  private state: string;

  constructor(provider: keyof Providers, config: OAuthConfig) {
    this.state = createId(64);
    config.redirectUri = `${config.redirectUri}?provider=${provider}&state=${this.state}`;
    this.provider = new providers[provider](config);
  }

  getAuthUrl() {
    return {
      state: this.state,
      url: this.provider.getAuthUrl()
    };
  }

  getAccessToken(code: string) {
    return this.provider.getAccessToken(code);
  }

  getUser(accessToken: string) {
    return this.provider.getUser(accessToken);
  }
}

export { type OAuthConfig, type UserInfo, OAuthProvider };