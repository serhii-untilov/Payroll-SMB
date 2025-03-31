@ECHO OFF
CHCP 1251 > NULL

CALL scripts/create_env.cmd
docker compose rm --force --stop --volumes
docker compose up db --detach --renew-anon-volumes --timestamps
