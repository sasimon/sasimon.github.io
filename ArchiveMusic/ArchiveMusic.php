<?php
try {
	file_put_contents("ArchiveMusic.sqlite",file_get_contents("php://input"));
	echo "Content written successfully.";
}
catch (Exception $e) {
	echo "Could not write to file.";
}
?>
