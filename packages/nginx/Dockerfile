FROM nginx:1.10.1-alpine
COPY ./packages/nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
