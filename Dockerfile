FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
# Cloudinary credentials, JWT_SECRET and SARVAM_API_KEY come from the platform's secret store, never the image.
CMD ["npm", "start"]
