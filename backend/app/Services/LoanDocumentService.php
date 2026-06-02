<?php

namespace App\Services;

use App\Models\LoanApplication;
use App\Models\LoanDocument;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LoanDocumentService
{
    private const GENERATED_DOCUMENTS = [
        [
            'type' => 'loan_application_form',
            'view' => 'pdf.loan-application-form',
            'file' => 'loan-application-form.pdf',
            'name' => 'Loan Application Form.pdf',
        ],
        [
            'type' => 'authorization_to_deduct',
            'view' => 'pdf.authorization-to-deduct',
            'file' => 'authorization-to-deduct.pdf',
            'name' => 'Authorization To Deduct.pdf',
        ],
        [
            'type' => 'promissory_note',
            'view' => 'pdf.promissory-note',
            'file' => 'promissory-note.pdf',
            'name' => 'Promissory Note.pdf',
        ],
        [
            'type' => 'supporting_documents',
            'view' => 'pdf.loan-supporting-documents',
            'file' => 'loan-supporting-documents.pdf',
            'name' => 'Loan Supporting Documents.pdf',
        ],
    ];

    public function generateDocuments(LoanApplication $loanApplication): LoanApplication
    {
        $loanApplication->load([
            'documents',
            'amortizations',
        ]);

        foreach (self::GENERATED_DOCUMENTS as $documentConfig) {
            $path = "loan-documents/generated/{$loanApplication->id}/{$documentConfig['file']}";

            $pdf = Pdf::loadView($documentConfig['view'], [
                'loan' => $loanApplication,
            ]);

            Storage::disk('public')->put($path, $pdf->output());

            LoanDocument::updateOrCreate(
                [
                    'loan_application_id' => $loanApplication->id,
                    'document_type' => $documentConfig['type'],
                ],
                [
                    'file_name' => $documentConfig['name'],
                    'file_path' => $path,
                    'status' => 'generated',
                    'is_signed' => false,
                    'generated_at' => now(),
                ]
            );
        }

        $loanApplication->update([
            'status' => 'documents_generated',
        ]);

        return $loanApplication->load('documents');
    }

    public function uploadSignedDocument(
        LoanApplication $loanApplication,
        string $documentType,
        UploadedFile $file
    ): LoanDocument {
        $path = $file->store(
            'loan-documents/signed/'.$loanApplication->id,
            'public'
        );

        $document = LoanDocument::updateOrCreate(
            [
                'loan_application_id' => $loanApplication->id,
                'document_type' => $documentType,
            ],
            [
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'status' => 'uploaded',
                'is_signed' => true,
                'uploaded_at' => now(),
            ]
        );

        $loanApplication->update([
            'status' => 'documents_uploaded',
        ]);

        return $document;
    }

    public function downloadDocument(LoanDocument $loanDocument): BinaryFileResponse
    {
        $fullPath = Storage::disk('public')->path($loanDocument->file_path);

        return response()->download($fullPath, $loanDocument->file_name);
    }

    public function exists(LoanDocument $loanDocument): bool
    {
        return Storage::disk('public')->exists($loanDocument->file_path);
    }
}
