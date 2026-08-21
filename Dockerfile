# Use the official nginx unprivileged image
FROM nginxinc/nginx-unprivileged:latest

# Copy the built static site from the public directory
# This will overwrite the default nginx files
COPY public/ /usr/share/nginx/html/

# Expose port 8080 (nginx-unprivileged uses 8080 instead of 80)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]