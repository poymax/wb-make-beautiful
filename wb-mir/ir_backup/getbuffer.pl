#!/usr/bin/perl
use 5.010;


foreach $i (2000, 2125, 2250, 2375) {
$command = qq (echo `modbus_client --debug -mrtu -b9600 -pnone -s2 /dev/ttyRS485-1 -a$ARGV[0] -t0x03 -r$i -c 125 | grep Data | sed -e 's/Data://' -e 's/s//g'`);

$a.=`$command`;

}
$command2 = qq (echo `modbus_client --debug -mrtu -b9600 -pnone -s2 /dev/ttyRS485-1 -a$ARGV[0] -t0x03 -r2500 -c 9 | grep Data | sed -e 's/Data://' -e 's/s//g'`);
$a.=`$command2`;


$a=~s/\n/ /g;
@a=split(' ',$a);
@dec = map hex, @a;
$b= join (' ',@dec);

say  $b;

