FROM ghcr.io/puppeteer/puppeteer:21.5.0

USER root

WORKDIR /app

COPY package*.json ./
# Install dependencies including puppeteer (though image has it, we ensure version match)
RUN npm install --only=production

COPY . .

# Create output directory and ensure permissions
RUN mkdir -p /app/output && chown -R pptruser:pptruser /app/output

USER pptruser

CMD ["node", "src/worker.js"]
