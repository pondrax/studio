import { db, schema, t } from '$lib/server/db';
import { createId, d } from '$lib/app/index.js';
import type { Cookies } from '@sveltejs/kit';

export class Session {
  static async create({
    userId,
    table,
    cookies,
    expired,
  }: {
    userId: string;
    table: string;
    cookies: Cookies;
    expired?: string | Date;
  }) {
    const sessionId = createId(128);
    const expiration = expired
      ? typeof expired === 'string'
        ? new Date(expired).toISOString()
        : expired.toISOString()
      : d().add(7, 'days').toISOString();

    const session = await db.insert(schema._session).values({
      id: sessionId,
      userId,
      table,
      expired: expiration
    } as any).returning();

    if (!session) {
      throw new Error('Failed to create session');
    }

    cookies.set('access_token', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week in seconds
    });

    return sessionId;
  }

  static async get(sessionId: string) {
    const session = await db
      .select()
      .from(schema._session)
      .where(t.eq(schema._session.id, sessionId))
      .limit(1);

    return session.at(0) ?? null;
  }

  static async destroy(sessionId: string) {
    await db
      .delete(schema._session)
      .where(t.eq(schema._session.id, sessionId));
  }
}
