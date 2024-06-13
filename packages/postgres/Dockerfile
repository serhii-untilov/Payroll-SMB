FROM postgres:15-alpine
COPY ./packages/postgres/init.postgres.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
