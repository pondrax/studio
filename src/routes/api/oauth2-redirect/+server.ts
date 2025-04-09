import { error, json } from "@sveltejs/kit";
import { OAuth, type Providers } from '$lib/server/auth/oauth.js'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH2_REDIRECT_URI } from "$env/static/private";

export async function GET({ cookies, url }) {
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  const storedState = cookies.get("oauth_state");
  const providerName = url.searchParams.get("provider") as keyof Providers;

  // console.log(state, storedState)
  if (!code || !state || state !== storedState || !providerName) {
    return error(400, { message: "Invalid state or code" })
  }

  const oauth = new OAuth(providerName, {
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    redirectUri: OAUTH2_REDIRECT_URI
  })
  const token = await oauth.getAccessToken(code)
  const user = await oauth.getUser(token)

  return json({
    // providerName,
    // state,
    // storedState,
    // code,
    // token,
    user,
    // userResponse
  });
}
