// app/api/proxy/route.js
export async function GET(req) {
  return proxy(req);
}

export async function POST(req) {
  return proxy(req);
}

export async function PUT(req) {
  return proxy(req);
}

export async function DELETE(req) {
  return proxy(req);
}

async function proxy(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response(
      JSON.stringify({ error: "Missing url query parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const targetUrl = `http://39.106.25.10:9090${url.startsWith("/") ? url : "/" + url}`;

  const method = req.method;
  const headers = new Headers(req.headers);
  headers.delete("host");

  const fetchOptions = {
    method,
    headers,
  };

  if (["POST", "PUT", "PATCH"].includes(method)) {
    const body = await req.text();
    fetchOptions.body = body;
  }

  const resp = await fetch(targetUrl, fetchOptions);

  const data = await resp.text();

  return new Response(data, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("content-type") || "application/json",
    },
  });
}
