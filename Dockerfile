FROM nginx:1.20.0-alpine
ADD build/. /usr/share/nginx/html
EXPOSE 80