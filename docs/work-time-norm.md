# Норма тривалості робочого часу (WorkTimeNorm)

[![Issue #230](https://img.shields.io/github/issues/detail/state/serhii-untilov/payroll-smb/230)](../issues/230)

Опис періодичних графіків роботи.

Використовується для заповнення планового та фактичного табелю обліку робочого часу.

## Структура

Attribute         |Type                                   |Name                                |Default
------------------|---------------------------------------|------------------------------------|--------------------------
code              |string(10)                             |Код                                 |null
name              |string(50)                             |Назва                               |not null
description       |string(250)                            |Опис                                |null
type              |[WorkTimeNormType](work-time-norm-type)|Тип обліку робочого часу            |[Day](work-time-norm-type)
dateFrom          |date                                   |Дата початку дії                    |2024-04-22
dateTo            |date                                   |Дата кінця дії                      |9999-12-31
applyHolidays     |boolean                                |Вплив святкових днів (заміщення)    |true
applyShortenedDays|boolean                                |Вплив скорочення передсвяткових днів|true
applyMovedDays    |boolean                                |Вплив перенесених святкових днів    |true
applyPhases       |boolean                                |Фази гнучкого графіка роботи        |false
applyRate         |boolean                                |Вплив кількості ставок працівника   |false

## Особливості реалізації

- [Audit](audit)
- [Soft deletion](soft-deletion)
- [Versioning](versioning)
- [Optimistic locking](optimistic-locking)
- [Company row permissions](company-row-permission)

## Заповнення

Виконується засобами міграції бази даних.
Перелік актуальних норм тривалості робочого часу публікується у профільних виданнях на кожен рік, наприклад:
[Дебет-Кредит: Норми тривалості робочого часу](https://services.dtkt.ua/catalogues/worktime/163-normi-trivalosti-robocogo-casu-na-2026-rik).

Початковий склад таблиці повинен включати норми:

- 40-годинний робочий тиждень, 5 днів (пн – пт – 8 год)
- 39-годинний робочий тиждень, 5 днів (пн – чт – 8 год , пт 7 год)

Норми на період дії воєнного стану (дата початку 2024-02-24):

- 40-годинний робочий тиждень, 6 днів (пн – пт – 7 год , сб 5 год)

Інші норми загального використання додавати за необхідності засобами міграції бази даних.
Норми, унікальні для підприємства додаються адміністратором підприємства.
Застосування загальних норм для усіх підприємств і унікальних норм для окремих підприємств забезпечується механізмом [Company row permissions](company-row-permission).

## Доступ

[Шаблон доступу до довідників](role-permission#шаблон-доступу-до-довідників)