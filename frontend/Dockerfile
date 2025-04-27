FROM node:20


WORKDIR /app

#
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --ignore-optional


COPY . .


EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--host", "--port", "3001"]
