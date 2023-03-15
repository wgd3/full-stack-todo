# Build the docker image with `npx nx docker-build client`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t client`.
FROM nginxinc/nginx-unprivileged

LABEL org.opencontainers.image.title="full-stack-todo angular client"
LABEL org.opencontainers.image.url="https://github.com/wgd3/full-stack-todo"
LABEL org.opencontainers.image.source=https://github.com/wgd3/full-stack-todo
LABEL org.opencontainers.image.description="Angular client for the Full Stack To-Do demo application"
LABEL org.opencontainers.image.licenses=MIT

LABEL org.opencontainers.image.source=https://github.com/wgd3/full-stack-todo
LABEL org.opencontainers.image.description="Angular client for the Full Stack To-Do demo application"
LABEL org.opencontainers.image.licenses=MIT


COPY dist/apps/client /usr/share/nginx/html
COPY apps/client/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

