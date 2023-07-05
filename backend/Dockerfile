# Compile TypeScript
FROM node:18 AS builder

EXPOSE 3001

WORKDIR /dist

COPY package* ./

RUN npm ci && npm cache clean --force

COPY . ./
RUN npm run build

# Run the application
FROM node:18

WORKDIR /usr/src/app
RUN chown node:node ./
USER node

ENV NODE_ENV=production

COPY --from=builder /dist/build ./
COPY package* ./

RUN npm ci --omit=dev && npm cache clean --force
CMD ["node", "index.js"]

