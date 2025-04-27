# Этап сборки
FROM golang:1.24 AS builder


WORKDIR /app


COPY go.mod go.sum ./


RUN go mod download


COPY . .


RUN GOOS=linux GOARCH=amd64 go build -o main .


RUN ls -la /app/main


FROM alpine:latest


RUN apk add --no-cache libc6-compat


WORKDIR /app


COPY --from=builder /app/main .


RUN mkdir -p /app/uploads


RUN ls -la /app/main


RUN chmod +x /app/main


CMD ["./main"]