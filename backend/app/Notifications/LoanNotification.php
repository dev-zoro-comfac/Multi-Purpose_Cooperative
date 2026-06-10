<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class LoanNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $message,
        private readonly string $type = 'loan',
        private readonly bool $success = true,
        private readonly array $extraData = []
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'category' => 'loan',
            'type' => $this->type,
            'data' => $this->extraData,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
