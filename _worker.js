export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    let key = null;

    // Support /ics/wp1.ics style
    if (path.startsWith('/ics/')) {
      key = path.replace('/ics/', '');
    }
    // Support /wp1.ics, /master.ics, /holidays.ics style
    else if (
      /^\/wp\d+\.ics$/.test(path) ||
      path === '/master.ics' ||
      path === '/holidays.ics'
    ) {
      key = path.slice(1);
    }

    if (key) {
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

    return env.ASSETS.fetch(request);
  }
};
