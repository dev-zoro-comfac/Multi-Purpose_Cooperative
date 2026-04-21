<?php

namespace App\Exports;

use Throwable;
use App\Models\User;
use App\Services\UserService;
use App\Notifications\User\ExportUsersStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements
    FromQuery,
    WithMapping,
    WithHeadings,
    ShouldQueue
{
    use Exportable;

    protected UserService $userService;
    protected array $requestQuery;

    public function __construct(protected string $requesterId)
    {
        $this->userService = app(UserService::class);
        $this->requestQuery = app(Request::class)->query();
    }


    public function query()
    {
        return $this->userService->listQuery($this->requestQuery);
    }

    public function map($user): array
    {
        return [
            'email' => $user->email,
            'first_name' => $user->profile->first_name ?? null,
            'middle_name' => $user->profile->middle_name ?? null,
            'last_name' => $user->profile->last_name ?? null,
            'gender' => $user->profile->gender ?? null,
            'contact_number' => $user->profile->contact_number ?? null,
            'created_at' => $user->created_at,
        ];
    }

    public function headings(): array
    {
        return [
            'Employee ID',
            'Email',
            'First Name',
            'Middle Name',
            'Last Name',
            'Gender',
            'Contact Number',
            'Created At',
        ];
    }
    public function failed(Throwable $exception): void
    {
        Log::error('Excel export failed', ['exception' => $exception]);

        $exporter = User::find($this->requesterId);

        $exporter?->notify(new ExportUsersStatusNotification([
            'success' => false,
            'message' => 'Excel export failed.' . $exception->getMessage()
        ]));
    }
}
