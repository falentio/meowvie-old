FROM denoland/deno:1.26.0

WORKDIR app
COPY . /app
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]
