import { error, redirect } from "@sveltejs/kit";
import { OAuth, type Providers } from '$lib/server/auth/oauth.js'
import { db, schema, t } from "$lib/server/db/index.js";


export async function GET({ url, params, cookies }) {
  try {
    const collectionName = params.name;
    const providerName = params.provider as keyof Providers;
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
    console.log(oauth)
    const { state, url: oauthUrl } = oauth.getAuthUrl();

    cookies.set("oauth_state", state, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax"
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: oauthUrl.toString(),
      }
    });

    // return redirect(302, oauthUrl.toString());
  } catch (e) {
    console.log(e)
    return error(404, { message: 'Page not found' })
  }
}