<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::first();
if ($user) {
    app('auth')->login($user);
}

$request = Illuminate\Http\Request::create('/dashboard', 'GET');

$response = $kernel->handle($request);
echo $response->getContent();
