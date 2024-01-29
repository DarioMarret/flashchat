git add .
git commit -m "registrar datos de la cuenta de facebook"
git push
export SHORT_COMMIT=$(git log -1 --pretty="%H" | cut -b -8)
export DOCKER_IMAGE_VERSION="dev_${SHORT_COMMIT}"
docker login -u "djmarret1992" -p "Tumadre1@" docker.io

docker build -t djmarret1992/flashchat:${DOCKER_IMAGE_VERSION} -f Dockerfile .
docker tag djmarret1992/flashchat:${DOCKER_IMAGE_VERSION} djmarret1992/flashchat:latest
docker push djmarret1992/flashchat:${DOCKER_IMAGE_VERSION}
docker push djmarret1992/flashchat:latest
echo "tag: ${DOCKER_IMAGE_VERSION}"

# correr docker
# docker run -p 8080:80 djmarret1992/flashchat:latest