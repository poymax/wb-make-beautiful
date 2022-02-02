Тема на форуме: https://support.wirenboard.com/t/wb-mir-wb-msw-skript-dlya-sohraneniya-i-zapisi-komand-ik-ir/7918/16

Набор скриптов для чтения и загрузки содержимого ПЗУ WB-MIR, WB-MSW v.3

## Скрипты
read_roms.pl чтение содержимого ПЗУ, каждый банк складывается в отдельный файл (rom_1.ir, rom_2.ir...rom_7.ir). Содержимое файла -- набор десятичных чисел.
Формат запуска: <./read_roms.pl directory modbus-address> directory -- имя директории (создается, если нет), modbus-address -- modbus-адрес устройства
Чтение выполняется с помощью modbus_client, параметры заданы в коде скрипта.

Обратная операция осуществляется при помощи write_roms.pl
Формат запуска: <./write_roms.pl directory modbus-address> directory -- имя директории, в которой хранятся считанные банки памяти. modbus-address -- modbus-адрес устройства, на которое загружаются банки памяти.


## Вспомогательные утилиты
putbuffer.pl -- вспомогательная утилита для перемещения банков памяти, используетсяс при выполнении read_roms.pl (putbuffer.pl -- обратная операция)

compare_bufs.pl -- вспомогательная утилита для сравнения полученных данных из банков ПЗУ.
Формат запуска: <./compare_bufs.pl rom_1_1.ir rom_1_2.ir>
