# Use Node.js official image based on Debian
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install Puppeteer dependencies and Chromium
RUN apt-get update \
    && apt-get install -y wget gnupg ca-certificates procps libxss1 \
      libasound2 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
      libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 \
      libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
      libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
      libxrandr2 libxrender1 libxshmfence1 libxss1 libxtst6 \
      chromium

# Set Puppeteer environment variables to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose port
EXPOSE 80

# Environment variable
ENV PORT 80

# Start command
CMD ["node", "app.js"]
