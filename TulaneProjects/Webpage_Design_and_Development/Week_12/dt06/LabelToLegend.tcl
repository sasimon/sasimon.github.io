# !/bin/sh
# LabelToLegend.tcl \
exec tclsh "$0" ${1+"$@"}

package require tdom

set inputFile [open "order.htm"]
set html [read $inputFile]
close $inputFile
set document [dom parse -html $html]
foreach node [$document selectNodes {//label[@for]}] {
	set fieldset [$node getElementById [$node getAttribute "for"]]
	set destination [$document createElement legend]
	$destination appendChild [$node firstChild]
	$fieldset insertBefore $destination [$fieldset firstChild]
	puts [$fieldset asXML]
	
}
