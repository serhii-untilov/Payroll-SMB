# Рольові права доступу (RolePermission)

Обмеження доступу користувачів до операцій над сутностями (таблицями) відповідно до ролі користувача.

Див. [Діаграма Права доступу](permissions-diagram).

## Структура

Attribute            |Type                                 |Name                                |Default
---------------------|-------------------------------------|------------------------------------|----------
roleId               |[Role](role)                         |Код                                 |not null
resource             |[Resource](resource)                 |Назва ресурсу                       |not null
action               |[Action](action)                     |Операція                            |not null
allowed              |boolean                              |Дозволено                           |false

**Примітка:** Якщо allowed: true хочаб для одної ролі користувача, операція доступна користувачу.

## Заповнення

Початкове заповнення виконується засобами міграції бази даних відповідно до [Типів ролей](role-type) та [Переліку ресурсів системи](resource).

В подальшому параметри доступу змінюються [Адміністратором системи](role-type) в розділі [Налаштування](settings) на сторінці [Рольові права доступу](role-permission).

Для початкового заповнення прав доступу, сутності (таблиці бази даних) діляться на дві групи: Довідники і Таблиці обліку.

## Шаблон доступу до довідників

Role type                 |Create|Read  |Update|Delete|Every company|Own company|Own card
--------------------------|------|------|------|------|-------------|-----------|--------
[System admin](role-type) |+     |+     |+     |+     |+            |           |
[Company admin](role-type)|+     |+     |+     |+     |             |+          |
[Accountant](role-type)   |      |+     |      |      |             |+          |
[Employee](role-type)     |      |+     |      |      |             |           |+
[Manager](role-type)      |      |+     |      |      |             |+          |

## Шаблон доступу до таблиць обліку

Role type                 |Create|Read  |Update|Delete|Every company|Own company|Own card
--------------------------|------|------|------|------|-------------|-----------|--------
[System admin](role-type) |+     |+     |+     |+     |+            |           |
[Company admin](role-type)|+     |+     |+     |+     |             |+          |
[Accountant](role-type)   |+     |+     |+     |+     |             |+          |
[Employee](role-type)     |      |+     |      |      |             |           |+
[Manager](role-type)      |      |+     |      |      |             |+          |