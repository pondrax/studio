// oauth-base.ts
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tenantId?: string;
}

export interface UserInfo {
  username: string;
  email: string | null;
  avatarUrl: string;
}

export abstract class OAuthProvider {
  constructor(protected config: OAuthConfig) { }
  abstract getAuthUrl(): string;
  abstract getAccessToken(code: string): Promise<string>;
  abstract getUser(accessToken: string): Promise<UserInfo>;
}