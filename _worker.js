export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve ICS files from R2 under /ics/
    if (path.startsWith('/ics/')) {
      const key = path.replace('/ics/', '');

      if (!key) {
        return new Response('Missing ICS filename', { status: 400 });
      }

      const object = await env.EMERGE_ICS.get(key);

      if (!object) {
        return new Response(`ICS file not found: ${key}`, { status: 404 });
      }

      return new Response(object.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Everything else goes to the static Pages site
    return env.ASSETS.fetch(request);
  }
};
