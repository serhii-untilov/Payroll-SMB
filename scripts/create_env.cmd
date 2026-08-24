@ECHO OFF
CHCP 1251 > NULL

if not exist ./.env (
  @ECHO "The .env file does not exist. Let's create it."
  @ECHO "# Replace "localhost" with the real ip address of an API backend server\nNEXT_PUBLIC_API_URL=http://localhost:3001" >.env
)

if not exist ../payroll-smb-backup/ (
  mkdir ../payroll-smb-backup
)

if not exist ../payroll-smb-db/ (
  mkdir ../payroll-smb-db
)
