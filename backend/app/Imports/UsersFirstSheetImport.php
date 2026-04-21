<?php

namespace App\Imports;

use App\Models\Profile;
use App\Models\User;
use App\Enums\GenderEnum;
use App\Enums\RoleEnum;
use App\Notifications\User\ImportUsersStatusNotification;
use App\Rules\LettersAndSpaceOnly;
use App\Services\UserService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\ImportFailed;
use Maatwebsite\Excel\Row;

class UsersFirstSheetImport implements
    OnEachRow,
    WithHeadingRow,
    WithValidation,
    WithChunkReading,
    SkipsEmptyRows,
    WithStartRow,
    WithEvents,
    ShouldQueue
{
    use Importable;

    public function __construct(
        private User $requester,
        private UserService $userService
    ) {}

    public function onRow(Row $row): void
    {
        $rowIndex = $row->getIndex();
        request()->merge(['_row' => $rowIndex]);

        $data = $row->toArray();

        try {
            $existingUser = User::withTrashed()->where('email', $data['email'])->first();

            if ($existingUser && $existingUser->trashed()) {
                throw new ModelNotFoundException(
                    "Cannot insert record, user with email {$data['email']} is soft-deleted."
                );
            }

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'email'      => $data['email'],
                    'updated_at' => now(),
                ]
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id'        => $user->id,
                    'first_name'     => $data['first_name'],
                    'middle_name'    => $data['middle_name'] ?? null,
                    'last_name'      => $data['last_name'],
                    'gender'         => $data['gender'] ?? null,
                    'contact_number' => $data['contact_number'] ?? null,
                ]
            );

            $user->syncRoles([RoleEnum::User->value]);
        } catch (\Exception $e) {
            Log::error("Error processing row {$rowIndex}: " . $e->getMessage(), [
                'exception' => $e,
            ]);
        }
    }

    public function chunkSize(): int
    {
        return 500;
    }

    public function startRow(): int
    {
        return 3;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email:rfc,strict,dns,sppof,filter,filter_unicode',
            ],

            'first_name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'last_name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                new LettersAndSpaceOnly()
            ],

            'contact_number' => [
                'nullable',
                'string',
            ],

            'gender' => [
                'nullable',
                Rule::in(
                    array_map(
                        fn($case) => $case->value,
                        GenderEnum::cases()
                    )
                ),
            ],
        ];
    }

    public function registerEvents(): array
    {
        $importer = $this->requester;

        return [
            AfterImport::class => function (AfterImport $event) use ($importer) {

                $importer?->notify(new ImportUsersStatusNotification([
                    'success' => true,
                    'message' => 'Users import has been completed.',
                ]));

                // broadcast(new UsersModified());
            },
            ImportFailed::class => function ($event) use ($importer) {

                $importer?->notify(new ImportUsersStatusNotification([
                    'success' => false,
                    'message' => 'Users import has failed.' . $event->getException()->getMessage()
                ]));

                Log::error('Excel import failed', ['exception' => $event->getException()]);
            },
        ];
    }
}
