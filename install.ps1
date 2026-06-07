php create_db.php
composer require laravel/breeze --dev
php artisan breeze:install react --no-interaction
npm install
npm install @xyflow/react
php artisan migrate --force
