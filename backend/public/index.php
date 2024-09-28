<?php

require_once dirname(dirname(__FILE__)).'\core\Router.php';
require_once dirname(dirname(__FILE__)).'\routes\api.php';

// Get the current URL path
$url = str_replace('/dietary-system/backend/public', '', $_SERVER['REQUEST_URI']);
$router->dispatch($url);

?>