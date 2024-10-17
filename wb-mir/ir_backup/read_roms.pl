#!/usr/bin/perl
use 5.010;

# ./get_rom.pl "directory" "modbus-address" - read banks from the device

$dir=$ARGV[0];

`mkdir $dir`;

print "Stoping wb-mqtt-serial \n";
`systemctl stop wb-mqtt-serial`;


foreach $i (0..$ARGV[3]-1) {

$reg=5200 + $i;
`modbus_client --debug -mrtu -b$ARGV[2] -pnone  -o 1200 -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x05 -r $reg 0`;
sleep(2);

}


foreach $i (0..$ARGV[3]-1) {

$reg=5200 + $i;
#`modbus_client --debug -mrtu -pnone -o 700 -s2 /dev/ttyRS485-1 -a2 -t0x05 -r $reg 0`;
#sleep(2);
`modbus_client --debug -mrtu -b$ARGV[2] -pnone -o 1200 -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x05 -r $reg 1`;
$j=$i+1;
sleep (20); print "->$j";

`./getbuffer.pl $ARGV[1] > ./$dir/rom_$j.ir`;
print "<-";
`modbus_client --debug -mrtu -b$ARGV[2] -pnone -o 1200 -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x05 -r $reg 0`;
sleep (2);
}

print "\n Starting wb-mqtt-serial \n";
`systemctl start wb-mqtt-serial`;

exit();
