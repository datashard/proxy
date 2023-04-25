FROM denoland/deno:1.32.5

EXPOSE 8000 
USER deno

ADD . .

CMD ["run", "--allow-net", "proxy.ts"]