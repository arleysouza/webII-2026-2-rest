FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
#  remove as dependências de desenvolvimento (devDependencies) que já foram instaladas na pasta node_modules
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
