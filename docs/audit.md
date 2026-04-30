# Audit

Логування операцій над записами сутностей (таблиць).

## Структура

Attribute            |Type                                 |Name                                |Default
---------------------|-------------------------------------|------------------------------------|----------
onDate               |DateTime                             |Дата та час події                   |not null
resource             |[Resource](resource)                 |Назва сутності                      |not null
resourceId           |integer                              |Id запису сутності (таблиці)        |not null
action               |[Action](action)                     |Операція                            |not null
user                 |[User](user)                         |Користувач, що здійснив операцію    |not null
remoteIp             |string(128)                          |IP адреса, з якої здійснено операцію|not null
dataBefore           |text (JSON)                          |об'єкт до змін                      |null
dataAfter            |text (JSON)                          |об'єкт після змін                   |null
