import { error, json } from "@sveltejs/kit";
import { OAuth, type Providers } from '$lib/server/auth/oauth.js'
import { db, schema, t } from "$lib/server/db/index.js";

export async function GET({ cookies, url }) {

  try {
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const collectionName = String(url.searchParams.get("collectionName"));

    const storedState = cookies.get("oauth_state");
    const providerName = url.searchParams.get("provider") as keyof Providers;

    // console.log(state, storedState)
    if (!code || !state || state !== storedState || !providerName) {
      return error(400, { message: "Invalid state or code" })
    }

    const collection = await db.query._collections.findFirst({
      where: t.eq(schema._collections.name, collectionName)
    })
    // @ts-ignore
    const { clientId, clientSecret } = (collection?.option?.oauth?.[providerName]);

    const oauth = new OAuth(providerName, {
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: url.protocol + '//' + url.host + '/api/oauth2-redirect'
    })
    const token = await oauth.getAccessToken(code)
    const user = await oauth.getUser(token)

    return new Response(JSON.stringify({
      accessToken: token,
      user: user
    }));

    // return redirect(302, oauthUrl.toString());
  } catch (e) {
    console.log(e)
    return error(500, { message: 'Internal Server Error' })
  }
}
