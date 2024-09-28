<?php

require_once(dirname(dirname(__FILE__)) . '\core\Router.php');

$router = new Router();

// Define routes with controller and action mappings
$router->add('/register', ['controller' => 'user', 'action' => 'register']);
$router->add('/login', ['controller' => 'user', 'action' => 'login']);

?>
