export async function onRequestGet(context) {
  const path = context.params.path;

  if (!path) {
    return new Response("Missing file path", { status: 400 });
  }

  const object = await context.env.EMERGE_ICS.get(path);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-type", "text/calendar; charset=utf-8");
  headers.set("cache-control", "public, max-age=300");

  return new Response(object.body, { headers });
}
