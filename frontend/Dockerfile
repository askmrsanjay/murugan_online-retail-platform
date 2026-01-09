FROM node:18-slim

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=my_super_secure_secret


COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

