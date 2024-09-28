<?php
class Router {
    private $routes = [];

    public function add($route, $params) {
        $this->routes[$route] = $params;
    }

    public function dispatch($url) {
        foreach ($this->routes as $route => $params) {
            if ($url === $route) {
                $controller = $this->loadController($params['controller']);
                $action = $params['action'];

                if (method_exists($controller, $action)) {
                    $controller->$action();
                } else {
                    echo "Method $action not found in controller " . $params['controller'];
                }

                return;
            }
        }

        echo "404 - Route not found!";
    }

    private function loadController($controller) {
        $controllerClass = ucfirst($controller) . 'Controller';
        require_once "../app/controllers/$controllerClass.php";
        return new $controllerClass();
    }
}
