// GitHub login for the CMS admin, served from the site's own domain
// (www.refinol.com/api/auth) instead of a *.workers.dev worker, so ISP blocks
// on workers.dev don't stop the team from logging in.
//
// Needs two environment variables in Cloudflare Pages → Settings → Variables:
//   GITHUB_CLIENT_ID      (plain text)
//   GITHUB_CLIENT_SECRET  (encrypted / secret)

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Login belum disiapkan: isi GITHUB_CLIENT_ID dan GITHUB_CLIENT_SECRET di Cloudflare Pages.', {
      status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // The CMS asks for "repo" (private repos) or "public_repo".
  const requested = url.searchParams.get('scope') || 'repo';
  const scope = requested.split(/[ ,]+/).every((s) => ['repo', 'public_repo', 'user'].includes(s))
    ? requested : 'repo';

  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // Checked in /api/callback to make sure the login was started from here.
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
