<?php

use App\Enums\RoleEnum;
use App\Models\LoanApplication;
use App\Models\LoanDocument;
use App\Models\Member;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
    Storage::fake('public');
});

function documentUser(RoleEnum $role): User
{
    return User::factory()->create()->assignRole($role->value);
}

function documentLoan(): LoanApplication
{
    $memberUser = documentUser(RoleEnum::Member);
    $memberUser->update([
        'email' => fake()->unique()->safeEmail(),
    ]);

    $member = Member::create([
        'user_id' => $memberUser->id,
        'member_no' => 'MEM-'.fake()->unique()->numerify('######'),
        'first_name' => 'Document',
        'last_name' => 'Member',
        'email' => $memberUser->email,
        'status' => 'active',
    ]);

    return LoanApplication::create([
        'application_no' => 'LOAN-'.fake()->unique()->numerify('######'),
        'member_id' => $member->id,
        'borrower_name' => 'Document Borrower',
        'borrower_email' => $memberUser->email,
        'amount_requested' => 12000,
        'status' => 'documents_generated',
    ]);
}

it('allows accounting to upload a signed loan document', function () {
    $accounting = documentUser(RoleEnum::Accounting);
    $loan = documentLoan();
    $file = UploadedFile::fake()->create('signed-promissory-note.pdf', 100, 'application/pdf');

    actingAs($accounting)
        ->postJson("/api/v1/loan-applications/{$loan->id}/upload-document", [
            'document_type' => 'promissory_note',
            'file' => $file,
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $document = LoanDocument::where('loan_application_id', $loan->id)
        ->where('document_type', 'promissory_note')
        ->firstOrFail();

    expect($document->status)->toBe('uploaded');
    expect($document->is_signed)->toBeTrue();
    expect($loan->fresh()->status)->toBe('documents_uploaded');
    Storage::disk('public')->assertExists($document->file_path);
});

it('blocks members from uploading documents for loans they do not own', function () {
    $member = documentUser(RoleEnum::Member);
    $loan = documentLoan();
    $file = UploadedFile::fake()->create('signed-promissory-note.pdf', 100, 'application/pdf');

    actingAs($member)
        ->postJson("/api/v1/loan-applications/{$loan->id}/upload-document", [
            'document_type' => 'promissory_note',
            'file' => $file,
        ])
        ->assertStatus(403);
});

it('allows authorized users to download existing loan documents', function () {
    $accounting = documentUser(RoleEnum::Accounting);
    $loan = documentLoan();
    $path = "loan-documents/signed/{$loan->id}/download-test.pdf";

    Storage::disk('public')->put($path, 'PDF contents');

    $document = LoanDocument::create([
        'loan_application_id' => $loan->id,
        'document_type' => 'promissory_note',
        'file_name' => 'download-test.pdf',
        'file_path' => $path,
        'status' => 'uploaded',
        'is_signed' => true,
        'uploaded_at' => now(),
    ]);

    $response = actingAs($accounting)
        ->get("/api/v1/loan-documents/{$document->id}/download")
        ->assertOk();

    expect($response->headers->has('content-disposition'))->toBeTrue();
});

it('returns 404 when the loan document file is missing', function () {
    $accounting = documentUser(RoleEnum::Accounting);
    $loan = documentLoan();

    $document = LoanDocument::create([
        'loan_application_id' => $loan->id,
        'document_type' => 'promissory_note',
        'file_name' => 'missing.pdf',
        'file_path' => 'loan-documents/signed/missing.pdf',
        'status' => 'uploaded',
        'is_signed' => true,
        'uploaded_at' => now(),
    ]);

    actingAs($accounting)
        ->getJson("/api/v1/loan-documents/{$document->id}/download")
        ->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
});
