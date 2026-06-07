<?php
spl_autoload_register(function ($class) {
    file_put_contents(__DIR__ . '/autoload.log', $class . "\n", FILE_APPEND);
}, true, true);

$_SERVER['REQUEST_URI'] = '/dashboard';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['HTTP_HOST'] = 'sakip2.test';

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/dashboard', 'GET');
$user = App\Models\User::first();
if ($user) {
    $app['auth']->login($user);
}

$response = $kernel->handle($request);
echo "Done";
