<?php

namespace App\Http\Controllers;

use App\Models\LoanApplication;
use App\Models\LoanDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\LoanActivityLog;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreLoanApplicationRequest;
use App\Http\Requests\UpdateLoanApplicationRequest;
use App\Http\Resources\LoanApplicationResource;
use App\Services\LoanCalculatorService;
use App\Models\LoanAmortization;
use App\Models\User;
use App\Models\Profile;
use App\Models\Member;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LoanApplicationController extends Controller
{
    public function index()
{
    $user = auth()->user();

    $query = LoanApplication::with([
        'documents',
        'activityLogs',
    ])->latest();

    if (
        $user &&
        $user->hasRole('member') &&
        ! $user->hasRole('admin') &&
        ! $user->hasRole('accounting')
    ) {
        $query->where('borrower_email', $user->email);
    }

    return response()->json([
        'success' => true,
        'data' => $query->get(),
    ]);

}

    public function calculate(Request $request, LoanCalculatorService $calculator)
{
    $data = $request->validate([
        'loan_amount' => 'required|numeric|min:1',
        'annual_rate' => 'nullable|numeric|min:0',
        'number_of_paydays' => 'required|integer|min:1',
        'processing_fee' => 'nullable|numeric|min:0',
    ]);

    return response()->json([
        'success' => true,
        'data' => $calculator->calculate($data),
    ]);
}

    public function store(
    StoreLoanApplicationRequest $request,
    LoanCalculatorService $calculatorService
) {
    $data = $request->validated();

    if (
    empty($data['member_id']) &&
    ! empty($data['borrower_email'])
) {
   $generatedPassword = 'Comfac123';

    $user = User::firstOrCreate(
        [
            'email' => $data['borrower_email'],
        ],
        [
            'password' => Hash::make($generatedPassword),
        ]
    );

    if (! $user->hasRole(RoleEnum::Member->value)) {
        $user->assignRole(RoleEnum::Member->value);
    }

    $nameParts = collect(explode(' ', $data['borrower_name']))
        ->filter()
        ->values();

    $firstName = $nameParts->first() ?: 'Member';
    $lastName = $nameParts->count() > 1
        ? $nameParts->last()
        : 'Borrower';

    if (! $user->profile) {
        $user->profile()->save(Profile::factory()->make([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'middle_name' => null,
            'contact_number' => $data['borrower_contact_number'] ?? null,
        ]));
    }

    $member = Member::firstOrCreate(
    [
        'user_id' => $user->id,
    ],
    [
        'member_no' => 'MEM-' . str_pad((string) (Member::count() + 1), 6, '0', STR_PAD_LEFT),
        'first_name' => $firstName,
        'last_name' => $lastName,
        'middle_name' => null,
        'email' => $data['borrower_email'],
        'contact_number' => $data['borrower_contact_number'] ?? null,
        'address' => $data['borrower_address'] ?? null,
        'status' => 'active',
    ]
);

    $data['member_id'] = $member->id;
    $data['is_coop_member'] = true;
}

    $calculation = $calculatorService->calculate([
        'loan_amount' => $data['amount_requested'],
        'annual_rate' => $data['annual_rate'] ?? 15,
        'number_of_paydays' => $data['number_of_paydays'] ?? 24,
        'processing_fee' => $data['processing_fee'] ?? 50,
    ]);

    $data['annual_rate'] = $calculation['annual_rate'];
    $data['number_of_paydays'] = $calculation['number_of_paydays'];
    $data['processing_fee'] = $calculation['processing_fee'];
    $data['amortization_per_payday'] = $calculation['amortization_per_payday'];
    $data['monthly_amortization'] = $calculation['monthly_amortization'];
    $data['total_interest'] = $calculation['total_interest'];
    $data['total_amount_payable'] = $calculation['total_amount_payable'];
    $data['net_proceeds'] = $calculation['net_proceeds'];

    $loan = LoanApplication::create($data);

    $loan->update([
        'application_no' => 'LOAN-' . str_pad($loan->id, 6, '0', STR_PAD_LEFT),
    ]);

    $loan->activityLogs()->create([
    'user_id' => auth()->id(),
    'action' => 'created',
    'notes' => 'Loan application was submitted.',
]); 

    foreach ($calculation['schedule'] as $row) {
        LoanAmortization::create([
            'loan_application_id' => $loan->id,
            'payday_no' => $row['payday_no'],
            'amortization' => $row['amortization'],
            'interest' => $row['interest'],
            'principal' => $row['principal'],
            'balance' => $row['balance'],
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Loan application created.',
        'data' => new LoanApplicationResource(
            $loan->load('documents', 'amortizations')
        ),
        'computation' => $calculation,
    ], 201);
}
    public function show(LoanApplication $loanApplication)
{
    return response()->json([
        'success' => true,
        'data' => new LoanApplicationResource(
            $loanApplication->load([
                'documents',
                'activityLogs.user',
                'amortizations',
            ])
        ),
    ]);
}


public function downloadPdf(
    LoanApplication $loanApplication
) {
    $loanApplication->load([
        'documents',
        'activityLogs.user',
    ]);

    $pdf = Pdf::loadView(
        'pdf.loan-application',
        [
            'loan' => $loanApplication,
        ]
    );

    return $pdf->download(
        $loanApplication->application_no . '.pdf'
    );
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

   public function generateDocuments(
    LoanApplication $loanApplication
) {
    $loanApplication->load([
        'documents',
        'amortizations',
    ]);
    $documents = [
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

    foreach ($documents as $doc) {

        $path = "loan-documents/generated/{$loanApplication->id}/{$doc['file']}";

        $pdf = Pdf::loadView($doc['view'], [
            'loan' => $loanApplication,
        ]);

        Storage::disk('public')->put(
            $path,
            $pdf->output()
        );

        LoanDocument::updateOrCreate(
            [
                'loan_application_id' => $loanApplication->id,
                'document_type' => $doc['type'],
            ],
            [
                'file_name' => $doc['name'],
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

    return response()->json([
        'success' => true,
        'message' => 'Loan documents generated successfully.',
        'data' => $loanApplication->load('documents'),
    ]);
}

    public function uploadDocument(Request $request, LoanApplication $loanApplication)
    {
        $data = $request->validate([
            'document_type' => [
                'required',
                'in:loan_application_form,authorization_to_deduct,promissory_note,supporting_documents',
            ],
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
    'loan_application_form',
    'authorization_to_deduct',
    'promissory_note',
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
    if (! in_array($loanApplication->status, [
    'submitted_for_evaluation',
    'reviewed',
    'pending',
    'created',
])) {
        return response()->json([
            'success' => false,
            'message' => 'Loan is not ready for approval.',
        ], 422);
    }

    $loanApplication->update([
        'status' => 'approved',
        'approved_at' => now(),
        'approved_by' => Auth::id(),
    ]);

    $loanApplication->activityLogs()->create([
    'user_id' => auth()->id(),
    'action' => 'approved',
    'notes' => 'Loan application was approved.',
]);

    LoanActivityLog::create([
        'loan_application_id' => $loanApplication->id,
        'user_id' => Auth::id(),
        'action' => 'approved',
        'notes' => 'Loan application approved.',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan application approved.',
        'data' => $loanApplication,
    ]);
}

public function release(
    LoanApplication $loanApplication
) {
    if ($loanApplication->status !== 'approved') {
        return response()->json([
            'success' => false,
            'message' => 'Loan is not approved yet.',
        ], 422);
    }

    $loanApplication->update([
        'status' => 'released',
        'released_at' => now(),
    ]);

    $loanApplication->activityLogs()->create([
    'user_id' => auth()->id(),
    'action' => 'released',
    'notes' => 'Loan proceeds were released to the borrower.',
]);

    LoanActivityLog::create([
        'loan_application_id' => $loanApplication->id,
        'user_id' => Auth::id(),
        'action' => 'released',
        'notes' => 'Loan released to borrower.',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan released successfully.',
        'data' => $loanApplication,
    ]);
}

public function reject(Request $request, LoanApplication $loanApplication)
{
    if (! in_array($loanApplication->status, [
    'submitted_for_evaluation',
    'reviewed',
    'pending',
    'created',
])) {
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

$loanApplication->activityLogs()->create([
    'user_id' => auth()->id(),
    'action' => 'rejected',
    'notes' => $request->accounting_notes ?: 'Loan application was rejected.',
]);

LoanActivityLog::create([
    'loan_application_id' => $loanApplication->id,
    'user_id' => Auth::id(),
    'action' => 'rejected',
    'notes' => $data['accounting_notes'] ?? null,
]);
    return response()->json([
        'success' => true,
        'message' => 'Loan application rejected.',
        'data' => $loanApplication,
    ]);
    }

        public function review(LoanApplication $loanApplication)
{
    if ($loanApplication->status !== 'submitted_for_evaluation') {
        return response()->json([
            'success' => false,
            'message' => 'Loan is not ready for review.',
        ], 422);
    }

    $loanApplication->update([
        'status' => 'reviewed',
        'reviewed_at' => now(),
        'reviewed_by' => Auth::id(),
    ]);

    LoanActivityLog::create([
        'loan_application_id' => $loanApplication->id,
        'user_id' => Auth::id(),
        'action' => 'reviewed',
        'notes' => 'Loan application reviewed.',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Loan reviewed successfully.',
        'data' => $loanApplication,
    ]);
}

public function dashboard()
{
    return response()->json([
        'success' => true,
        'data' => [
            'total_loans' => LoanApplication::count(),
            'pending_loans' => LoanApplication::where('status', 'submitted_for_evaluation')->count(),
            'documents_generated' => LoanApplication::where('status', 'documents_generated')->count(),
            'documents_uploaded' => LoanApplication::where('status', 'documents_uploaded')->count(),
            'submitted_for_evaluation' => LoanApplication::where('status', 'submitted_for_evaluation')->count(),
            'reviewed_loans' => LoanApplication::where('status', 'reviewed')->count(),
            'approved_loans' => LoanApplication::where('status', 'approved')->count(),
            'released_loans' => LoanApplication::where('status', 'released')->count(),
            'rejected_loans' => LoanApplication::where('status', 'rejected')->count(),

            'total_amount_requested' => LoanApplication::sum('amount_requested'),
            'total_amount_approved' => LoanApplication::whereIn('status', ['approved', 'released'])
                ->sum('amount_requested'),
            'total_net_proceeds' => LoanApplication::whereIn('status', ['approved', 'released'])
                ->sum('net_proceeds'),
        ],
    ]);
}

}