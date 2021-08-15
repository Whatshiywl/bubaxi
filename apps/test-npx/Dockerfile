FROM nginx:1.21.1-alpine

RUN mkdir /etc/nginx/templates && \
    mv /etc/nginx/conf.d/default.conf /etc/nginx/templates/default.conf.template && \
    sed -i -e 's#80;#${PORT};#g' /etc/nginx/templates/default.conf.template

COPY . /usr/share/nginx/html
