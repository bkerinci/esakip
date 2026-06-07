<?php

namespace App\Traits;

use App\Models\LogAktivitas;
use Illuminate\Support\Facades\Auth;

trait Loggable
{
    public static function bootLoggable()
    {
        static::created(function ($model) {
            self::logAction($model, 'CREATE');
        });

        static::updated(function ($model) {
            self::logAction($model, 'UPDATE');
        });

        static::deleted(function ($model) {
            self::logAction($model, 'DELETE');
        });
    }

    protected static function logAction($model, $action)
    {
        // Don't log if running from console/seeder
        if (app()->runningInConsole()) {
            return;
        }

        $user = Auth::user();
        $oldData = $action === 'UPDATE' ? $model->getOriginal() : null;
        $newData = $action === 'DELETE' ? null : $model->getAttributes();

        LogAktivitas::create([
            'user_id' => $user ? $user->id : null,
            'aktivitas' => $action,
            'deskripsi' => "Melakukan {$action} pada " . class_basename($model) . " (ID: {$model->id})",
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'data_lama' => $oldData ? json_encode($oldData) : null,
            'data_baru' => $newData ? json_encode($newData) : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
