npm run build
set IMAGE_TAG=registry.cn-hangzhou.aliyuncs.com/ikeyit/management-web:0.0.4
docker build -t %IMAGE_TAG% .
docker push %IMAGE_TAG%