FROM denoland/deno:1.26.0

WORKDIR app
COPY . /app
RUN deno cache main.ts

CMD ["run", "--no-remote", "--allow-net", "--allow-read", "--allow-env=DENO_DEPLOYMENT_ID", "main.ts"]
