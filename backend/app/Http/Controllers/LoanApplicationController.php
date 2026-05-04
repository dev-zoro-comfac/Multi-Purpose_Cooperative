<?php

namespace App\Http\Controllers;

use App\Models\LoanApplication;
use App\Models\LoanDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;


class LoanApplicationController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => LoanApplication::with('documents')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'borrower_name' => 'required|string|max:255',
            'borrower_address' => 'nullable|string|max:255',
            'borrower_age' => 'nullable|integer|min:18',
            'borrower_civil_status' => 'nullable|string|max:100',
            'borrower_employer' => 'nullable|string|max:255',
            'borrower_length_of_service' => 'nullable|string|max:100',
            'amount_requested' => 'required|numeric|min:1',
            'take_home_pay_15' => 'nullable|numeric',
            'take_home_pay_30' => 'nullable|numeric',
            'is_coop_member' => 'boolean',
            'member_since' => 'nullable|date',
            'co_maker_name' => 'nullable|string|max:255',
            'co_maker_address' => 'nullable|string|max:255',
            'co_maker_age' => 'nullable|integer|min:18',
            'co_maker_civil_status' => 'nullable|string|max:100',
            'co_maker_employer' => 'nullable|string|max:255',
            'co_maker_length_of_service' => 'nullable|string|max:100',
        ]);

        $loan = LoanApplication::create($data);

        $loan->update([
            'application_no' => 'LOAN-' . str_pad($loan->id, 6, '0', STR_PAD_LEFT),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Loan application created.',
            'data' => $loan->load('documents'),
        ], 201);
    }

    public function show(LoanApplication $loanApplication)
    {
        return response()->json([
            'success' => true,
            'data' => $loanApplication->load('documents'),
        ]);
    }

    public function update(Request $request, LoanApplication $loanApplication)
    {
        $data = $request->validate([
            'borrower_name' => 'sometimes|required|string|max:255',
            'borrower_address' => 'nullable|string|max:255',
            'borrower_age' => 'nullable|integer|min:18',
            'borrower_civil_status' => 'nullable|string|max:100',
            'borrower_employer' => 'nullable|string|max:255',
            'borrower_length_of_service' => 'nullable|string|max:100',
            'amount_requested' => 'sometimes|required|numeric|min:1',
            'take_home_pay_15' => 'nullable|numeric',
            'take_home_pay_30' => 'nullable|numeric',
            'is_coop_member' => 'boolean',
            'member_since' => 'nullable|date',
            'co_maker_name' => 'nullable|string|max:255',
            'co_maker_address' => 'nullable|string|max:255',
            'co_maker_age' => 'nullable|integer|min:18',
            'co_maker_civil_status' => 'nullable|string|max:100',
            'co_maker_employer' => 'nullable|string|max:255',
            'co_maker_length_of_service' => 'nullable|string|max:100',
        ]);

        $loanApplication->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Loan application updated.',
            'data' => $loanApplication->load('documents'),
        ]);
    }

    public function generateDocuments(LoanApplication $loanApplication)
{
    $basePath = "loan-documents/generated/{$loanApplication->id}";
    $fileName = "Loan Supporting Documents.pdf";
    $filePath = "{$basePath}/loan-supporting-documents.pdf";

    $pdf = Pdf::loadView('pdf.loan-supporting-documents', [
        'loan' => $loanApplication,
    ])->setPaper('legal', 'portrait');

    Storage::disk('public')->put($filePath, $pdf->output());

    LoanDocument::updateOrCreate(
        [
            'loan_application_id' => $loanApplication->id,
            'document_type' => 'supporting_documents',
        ],
        [
            'file_name' => $fileName,
            'file_path' => $filePath,
            'status' => 'generated',
            'is_signed' => false,
            'generated_at' => now(),
        ]
    );

    $loanApplication->update([
        'status' => 'documents_generated',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan supporting documents generated successfully.',
        'data' => $loanApplication->load('documents'),
    ]);
}

    public function uploadDocument(Request $request, LoanApplication $loanApplication)
    {
        $data = $request->validate([
            'document_type' => 'required|in:supporting_documents',
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->store('loan-documents/signed/' . $loanApplication->id, 'public');

        $document = LoanDocument::updateOrCreate(
            [
                'loan_application_id' => $loanApplication->id,
                'document_type' => $data['document_type'],
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

        return response()->json([
            'success' => true,
            'message' => 'Signed document uploaded.',
            'data' => $document,
        ]);
    }

    public function downloadDocument(LoanDocument $loanDocument)
{
    if (! Storage::disk('public')->exists($loanDocument->file_path)) {
        return response()->json([
            'success' => false,
            'message' => 'File not found.',
        ], 404);
    }

    $fullPath = Storage::disk('public')->path($loanDocument->file_path);

    return response()->download($fullPath, $loanDocument->file_name);
}

    public function submitForEvaluation(LoanApplication $loanApplication)
    {
        $requiredDocuments = [
    'supporting_documents',
];

        foreach ($requiredDocuments as $type) {
            $hasUploaded = $loanApplication->documents()
                ->where('document_type', $type)
                ->where('status', 'uploaded')
                ->where('is_signed', true)
                ->exists();

            if (! $hasUploaded) {
                return response()->json([
                    'success' => false,
                    'message' => "Missing uploaded signed document: {$type}",
                ], 422);
            }
        }

        $loanApplication->update([
            'status' => 'submitted_for_evaluation',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Loan application submitted for evaluation.',
            'data' => $loanApplication->load('documents'),
        ]);
}
    public function approve(LoanApplication $loanApplication)
{
    if ($loanApplication->status !== 'submitted_for_evaluation') {
        return response()->json([
            'success' => false,
            'message' => 'Loan is not ready for approval.',
        ], 422);
    }

    $loanApplication->update([
        'status' => 'approved',
        'approved_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan application approved.',
        'data' => $loanApplication,
    ]);
}

public function reject(Request $request, LoanApplication $loanApplication)
{
    if ($loanApplication->status !== 'submitted_for_evaluation') {
        return response()->json([
            'success' => false,
            'message' => 'Loan is not ready for rejection.',
        ], 422);
    }

    $data = $request->validate([
        'accounting_notes' => 'nullable|string|max:500',
    ]);

    $loanApplication->update([
        'status' => 'rejected',
        'rejected_at' => now(),
        'accounting_notes' => $data['accounting_notes'] ?? null,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan application rejected.',
        'data' => $loanApplication,
    ]);

        
    }
}