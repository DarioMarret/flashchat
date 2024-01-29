FROM node:19-alpine as builder
WORKDIR /app

COPY . /app

RUN npm install --force
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build/index.html /usr/share/nginx/html
# COPY --from=builder /app/build/xtrim-front-autoservicio /usr/share/nginx/html/autoservicio
COPY --from=builder /app/build /usr/share/nginx/html/

EXPOSE 80
