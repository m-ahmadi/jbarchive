<?php




header('Content-Type: application/json');

json_encode( readfile('users.json') );



//echo json_encode($data);






?>
