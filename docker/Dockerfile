#Grab the latest alpine image
FROM nginx:1.15
COPY ./ui_react/public/ /usr/share/nginx/html
COPY ./ui_react/dist /usr/share/nginx/html/dist
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
