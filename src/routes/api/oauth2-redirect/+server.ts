import { error, json } from "@sveltejs/kit";
import { OAuth, type Providers } from '$lib/server/auth/oauth.js'
import { db, schema, t } from "$lib/server/db/index.js";
import { Session } from "$lib/server/auth/session";
import { d, createId } from "$lib/app";

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
    const token = await oauth.getAccessToken(code);
    const user = await oauth.getUser(token);

    //@ts-ignore
    let existingUser = await db.query[collectionName].findFirst({
      // @ts-ignore
      where: t.eq(schema[collectionName].email, user.email)
    });

    if (!existingUser) {
      // @ts-ignore
      existingUser = await db.insert(schema[collectionName])
        .values({
          username: user.email?.split('@')?.[0] + createId(8),
          email: user.email,
          password: '',
        })
        .returning();
      //   throw error(400, { message: 'User not exists' });
    }

    const sessionId = await Session.create({
      userId: existingUser.id,
      table: collectionName,
      cookies,
      expired: d().add(7, 'days').toDate()
    })
    cookies.set('access_user', JSON.stringify(user), {
      path: "/",
      secure: true,
      httpOnly: false,
      maxAge: 60 * 10,
      sameSite: "lax"
    });

    cookies.delete("oauth_state", {
      path: "/",
    });
    // return json({ accessToken: token, user: user })
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/main'
      }
    });

  } catch (e) {
    console.log(e)
    return error(500, { message: 'Internal Server Error' })
  }
}
