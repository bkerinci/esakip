<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

spl_autoload_register(function ($class) {
    file_put_contents(__DIR__ . '/autoload.log', $class . "\n", FILE_APPEND);
}, true, true);

$request = Illuminate\Http\Request::create('/dashboard', 'GET');
$user = App\Models\User::first();
if ($user) {
    app('auth')->login($user);
}
$response = app()->make(Illuminate\Contracts\Http\Kernel::class)->handle($request);
echo "Done";
