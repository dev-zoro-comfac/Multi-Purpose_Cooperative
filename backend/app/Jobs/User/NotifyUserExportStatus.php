<?php

namespace App\Jobs\User;

use App\Models\User;
use App\Notifications\User\ExportUsersStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class NotifyUserExportStatus implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        protected string $requesterId,
        protected $filename = null,
    ) {}

    public function handle(): void
    {
        $exporter = User::find($this->requesterId);
        $filepath = "exports/users/{$this->filename}";

        if (! Storage::disk('private')->exists($filepath)) {
            $exporter?->notify(new ExportUsersStatusNotification([
                'success' => false,
                'message' => 'User export has failed.',
            ]));
        } else {
            $apiURL = config('app.api_url');
            $downloadURL = "{$apiURL}/users/export/download/{$this->filename}";

            $exporter?->notify(new ExportUsersStatusNotification([
                'success' => true,
                'message' => 'User export file is ready to download.',
                'data' => [
                    'download_link' => $downloadURL,
                ],
            ]));
        }
    }
}
