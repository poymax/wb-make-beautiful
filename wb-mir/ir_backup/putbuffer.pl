#!/usr/bin/perl
use 5.010;
use strict;

open BUFF, $ARGV[0];


my (@buff)=split('\s', <BUFF>);

my $i;
my $data;

foreach $i (2000, 2121, 2242, 2363) {
		$data="@buff[$i-2000..$i-2000+120]";
		print "modbus_client --debug -mrtu -b9600  -pnone -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x10 -r$i $data \n";
		`modbus_client --debug -mrtu -b9600  -pnone -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x10 -r$i $data`;
				    }
$i=2484;
$data="@buff[$i-2000..$i-2000+22]";
`modbus_client --debug -mrtu -b9600 -pnone -s2 /dev/ttyRS485-1 -a$ARGV[1] -t0x10 -r$i $data`;

exit();

