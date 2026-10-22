// GitHub sends the user back here after they approve the login.
// We swap the one-time code for a token and hand it to the CMS window that opened the popup.

// JSON that is safe to place inside a <script> tag.
const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const page = (origin, status, payload) => {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return new Response(`<!doctype html>
<html lang="id"><head><meta charset="utf-8"><title>Login admin</title></head>
<body style="font-family:system-ui,sans-serif;padding:24px">
<p>${status === 'success' ? 'Login berhasil, jendela ini akan tertutup.' : 'Login gagal. Tutup jendela ini dan coba lagi.'}</p>
<script>
(function () {
  var origin = ${js(origin)};
  var message = ${js(message)};
  if (!window.opener) { document.body.insertAdjacentHTML('beforeend', '<p>Buka admin dari ' + origin + '/admin/ lalu login lagi.</p>'); return; }
  // Handshake used by Decap CMS: say we're authorizing, wait for the admin to answer, then send the result
  // only to the admin on this same domain.
  window.addEventListener('message', function (e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(message, origin);
    setTimeout(function () { window.close(); }, 300);
  }, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>
</body></html>`, {
    status: status === 'success' ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // Clear the one-time state cookie.
      'Set-Cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
};

const readCookie = (request, name) => {
  const header = request.headers.get('Cookie') || '';
  const match = header.split(/;\s*/).find((c) => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : '';
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (url.searchParams.get('error')) {
    return page(origin, 'error', { message: url.searchParams.get('error_description') || 'Login dibatalkan.' });
  }
  if (!code || !state || state !== readCookie(request, 'cms_oauth_state')) {
    return page(origin, 'error', { message: 'Sesi login kedaluwarsa. Coba login lagi dari halaman admin.' });
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'refinol-cms-auth' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = await res.json();
    if (!data.access_token) {
      return page(origin, 'error', { message: data.error_description || 'GitHub tidak memberikan akses.' });
    }
    return page(origin, 'success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    return page(origin, 'error', { message: 'Tidak bisa menghubungi GitHub. Coba lagi sebentar.' });
  }
}
