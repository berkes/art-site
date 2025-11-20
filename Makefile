
HUGO_VERSION=0.151.0


## Everything is .phony
.PHONY: install clean build preview deploy

install:
	podman run --rm --entrypoint hugo -v ${PWD}:/src hugomods/hugo:${HUGO_VERSION} version

clean:
	rm -rf public/

build:
	podman run --rm --entrypoint hugo -v ${PWD}:/src hugomods/hugo:${HUGO_VERSION} build --minify

preview:
	podman run --rm --entrypoint hugo -v ${PWD}:/src --publish 8080:8080 hugomods/hugo:${HUGO_VERSION} server --watch --port 8080 --bind 0.0.0.0

deploy: 
	echo "The CI pipeline handles deployment. Just push to the main branch."


