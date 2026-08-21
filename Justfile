HUGO_VERSION := "0.151.0"

# Verify Hugo installation
install:
    docker run --rm --entrypoint hugo -v ${PWD}:/src hugomods/hugo:{{HUGO_VERSION}} version

# Remove generated files
clean:
    rm -rf public/

# Build the static site for production
build:
    docker run --rm --entrypoint hugo -v ${PWD}:/src hugomods/hugo:{{HUGO_VERSION}} build --minify --cleanDestinationDir

alias dev := preview
alias develop := preview
# Run a local development server with live reload
preview:
    docker run --rm --entrypoint hugo -v ${PWD}:/src --publish 8080:8080 hugomods/hugo:{{HUGO_VERSION}} server --watch --port 8080 --bind 0.0.0.0

# Deployment reminder
deploy:
    echo "The CI pipeline handles deployment. Just push to the main branch."
