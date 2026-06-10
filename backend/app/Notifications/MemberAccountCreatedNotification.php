<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MemberAccountCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $token,
        private readonly ?string $borrowerName = null
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $setupUrl = $frontendUrl.'/reset-password?token='.$this->token.'&email='.urlencode($notifiable->getEmailForPasswordReset());
        $name = $this->borrowerName ?: 'Borrower';

        return (new MailMessage)
            ->subject('Your Cornersteel Cooperative borrower portal account is ready')
            ->greeting("Hello {$name},")
            ->line('Your loan application has been reviewed by accounting.')
            ->line('A borrower portal account has been created for you so you can access your dashboard and loan details.')
            ->action('Set Up Your Password', $setupUrl)
            ->line('After setting your password, you can log in and view your loan status, documents, and amortization schedule.')
            ->line('If you did not apply for a loan, please contact Cornersteel Cooperative.');
    }
}
