#!/usr/bin/perl
$file1 = $ARGV[0];
$file2 = $ARGV[1];


open F1, $file1;
open F2, $file2;


$a1 = <F1>; @a1= split (' ',$a1);
$a2 = <F2>; @a2= split (' ',$a2);


foreach $i (0..508) {

$diff= abs($a1[$i]-$a2[$i]);

print "$i:\t$a1[$i]\t$a2[$i]\t$diff\n";

}
