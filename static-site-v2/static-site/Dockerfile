FROM arm32v7/nginx:stable-alpine

# our config replaces the default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy all site assets (index.html, 404.html, styles.css, scripts.js)
COPY site/ /usr/share/nginx/html/
