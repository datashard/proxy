import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

serve( async (req) => {
    let url1 = new URL(req.url)
    const url2 = new URL(url1.pathname, 'https://raw.githubusercontent.com/')
    
    if(url1.pathname === '/') return Response.redirect("https://github.com/datashard/proxy")
    
    const res = await fetch(url2)
    const headers = Object.fromEntries([...res.headers]);

    const typescriptTypes = new URL("/@deno-types" + url2.pathname, url1.origin);
    const finalHeaders = {
        ...headers,
        ...Object.fromEntries([
          ["content-type", url1.searchParams.has("js") ? "text/javascript" : "text/typescript"],
          ['accept-ranges', 'bytes'],
          ['access-control-allow-origin', '*'],
          ['cache-control', 'max-age=30, public'],
          ...(!url1.pathname.startsWith("/@deno-types") ? [['x-typescript-types', typescriptTypes.toString()]] : [])
        ])
      };

    return new Response(await res.arrayBuffer(), {
        headers: finalHeaders, 
        status: 200
    })
})