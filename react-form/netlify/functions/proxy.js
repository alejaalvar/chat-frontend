const RAILWAY = "https://instant-messaging-app-production.up.railway.app";

exports.handler = async (event) => {
  const url =
    RAILWAY + event.path + (event.rawQuery ? `?${event.rawQuery}` : "");

  const res = await fetch(url, {
    method: event.httpMethod,
    headers: {
      ...event.headers,
      host: "instant-messaging-app-production.up.railway.app",
      "accept-encoding": "identity",
    },
    ...(!["GET", "HEAD"].includes(event.httpMethod) && event.body
      ? { body: event.body }
      : {}),
  });

  const body = await res.text();
  const headers = {};
  res.headers.forEach((v, k) => {
    if (k !== "transfer-encoding") headers[k] = v;
  });

  return { statusCode: res.status, headers, body };
};
