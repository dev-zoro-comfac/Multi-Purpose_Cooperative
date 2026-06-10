<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreLoanApplicationRequest;
use App\Http\Resources\LoanApplicationResource;
use App\Models\LoanAmortization;
use App\Models\LoanApplication;
use App\Models\LoanDocument;
use App\Models\Member;
use App\Models\User;
use App\Notifications\LoanNotification;
use App\Services\LoanAccountService;
use App\Services\LoanCalculatorService;
use App\Services\LoanDashboardService;
use App\Services\LoanDocumentService;
use App\Services\LoanWorkflowService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class LoanApplicationController extends Controller
{
    private function canManageLoans(?User $user): bool
    {
        return $user?->hasAnyRole([
            RoleEnum::Admin->value,
            RoleEnum::Accounting->value,
        ]) ?? false;
    }

    private function canUseBorrowerPortal(?User $user): bool
    {
        return $user?->hasAnyRole([
            RoleEnum::Member->value,
            RoleEnum::NonMember->value,
        ]) ?? false;
    }

    private function canAccessLoan(LoanApplication $loanApplication): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        if ($this->canManageLoans($user)) {
            return true;
        }

        if (! $this->canUseBorrowerPortal($user)) {
            return false;
        }

        if ($loanApplication->borrower_email === $user->email) {
            return true;
        }

        return Member::where('id', $loanApplication->member_id)
            ->where('user_id', $user->id)
            ->exists();
    }

    private function authorizeLoanAccess(LoanApplication $loanApplication): void
    {
        abort_unless($this->canAccessLoan($loanApplication), 403, 'You are not allowed to access this loan application.');
    }

    private function authorizeLoanManager(): void
    {
        abort_unless($this->canManageLoans(auth()->user()), 403, 'You are not allowed to manage loan applications.');
    }

    private function workflowResponse(array $result)
    {
        if (! ($result['success'] ?? false)) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['status'] ?? 422);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['loan'],
        ]);
    }

    public function index()
    {
        $user = auth()->user();

        abort_unless(
            $this->canManageLoans($user) || $this->canUseBorrowerPortal($user),
            403,
            'You are not allowed to view loan applications.'
        );

        $query = LoanApplication::with([
            'documents',
            'activityLogs',
        ])->latest();

        if (
            $user &&
            $this->canUseBorrowerPortal($user) &&
            ! $this->canManageLoans($user)
        ) {
            $query->where(function ($query) use ($user) {
                $query->where('borrower_email', $user->email)
                    ->orWhereHas('member', function ($memberQuery) use ($user) {
                        $memberQuery->where('user_id', $user->id);
                    });
            });
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
        LoanCalculatorService $calculatorService,
        LoanAccountService $loanAccountService,
        LoanDocumentService $loanDocumentService
    ) {
        $data = $request->validated();
        $authenticatedUser = auth()->user();

        if (! $this->canManageLoans($authenticatedUser)) {
            abort_unless(
                $this->canUseBorrowerPortal($authenticatedUser),
                403,
                'You are not allowed to create loan applications.'
            );

            if (! empty($data['member_id'])) {
                abort_unless(
                    Member::where('id', $data['member_id'])
                        ->where('user_id', $authenticatedUser->id)
                        ->exists(),
                    403,
                    'You can only create loan applications for your own member account.'
                );
            }

            if (! empty($data['borrower_email'])) {
                abort_unless(
                    $data['borrower_email'] === $authenticatedUser->email,
                    403,
                    'You can only create loan applications with your own email address.'
                );
            } else {
                $data['borrower_email'] = $authenticatedUser->email;
            }
        }

        $data = $loanAccountService->attachBorrowerMember($data);

        $calculation = $calculatorService->calculate([
            'loan_amount' => $data['amount_requested'],
            'annual_rate' => $data['annual_rate'] ?? config('loan.default_annual_rate'),
            'number_of_paydays' => $data['number_of_paydays'] ?? config('loan.default_number_of_paydays'),
            'processing_fee' => $data['processing_fee'] ?? config('loan.default_processing_fee'),
            'payment_frequency' => $data['payment_frequency'] ?? config('loan.default_payment_frequency'),
            'computation_method' => $data['computation_method'] ?? config('loan.default_computation_method'),
        ]);

        $data['annual_rate'] = $calculation['annual_rate'];
        $data['number_of_paydays'] = $calculation['number_of_paydays'];
        $data['computation_method'] = $calculation['computation_method'];
        $data['processing_fee'] = $calculation['processing_fee'];
        $data['amortization_per_payday'] = $calculation['amortization_per_payday'];
        $data['monthly_amortization'] = $calculation['monthly_amortization'];
        $data['total_interest'] = $calculation['total_interest'];
        $data['total_amount_payable'] = $calculation['total_amount_payable'];
        $data['net_proceeds'] = $calculation['net_proceeds'];

        $loan = LoanApplication::create($data);

        $loan->update([
            'application_no' => 'LOAN-'.str_pad($loan->id, 6, '0', STR_PAD_LEFT),
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

        $loan = $loanDocumentService->generateDocuments($loan);

        $loan->activityLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'documents_generated',
            'notes' => 'Official loan documents were generated for printing and wet signature.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Loan application created and official documents generated.',
            'data' => new LoanApplicationResource(
                $loan->load('documents', 'amortizations', 'activityLogs.user')
            ),
            'computation' => $calculation,
        ], 201);
    }

    public function publicStore(
        StoreLoanApplicationRequest $request,
        LoanCalculatorService $calculatorService
    ) {
        $data = $request->validated();

        $calculation = $calculatorService->calculate([
            'loan_amount' => $data['amount_requested'],
            'annual_rate' => $data['annual_rate'] ?? config('loan.default_annual_rate'),
            'number_of_paydays' => $data['number_of_paydays'] ?? config('loan.default_number_of_paydays'),
            'processing_fee' => $data['processing_fee'] ?? config('loan.default_processing_fee'),
            'payment_frequency' => $data['payment_frequency'] ?? config('loan.default_payment_frequency'),
            'computation_method' => $data['computation_method'] ?? config('loan.default_computation_method'),
        ]);

        $data['application_source'] = 'public';
        $data['status'] = LoanApplication::STATUS_PENDING;
        $data['loan_type'] = $data['loan_type'] ?? 'non_member';
        $data['annual_rate'] = $calculation['annual_rate'];
        $data['number_of_paydays'] = $calculation['number_of_paydays'];
        $data['computation_method'] = $calculation['computation_method'];
        $data['processing_fee'] = $calculation['processing_fee'];
        $data['amortization_per_payday'] = $calculation['amortization_per_payday'];
        $data['monthly_amortization'] = $calculation['monthly_amortization'];
        $data['total_interest'] = $calculation['total_interest'];
        $data['total_amount_payable'] = $calculation['total_amount_payable'];
        $data['net_proceeds'] = $calculation['net_proceeds'];

        $loan = LoanApplication::create($data);

        $loan->update([
            'application_no' => 'LOAN-'.str_pad($loan->id, 6, '0', STR_PAD_LEFT),
        ]);

        $loan->activityLogs()->create([
            'user_id' => null,
            'action' => 'public_application_submitted',
            'notes' => 'Online public loan application received for accounting review.',
        ]);

        User::role([RoleEnum::Admin->value, RoleEnum::Accounting->value])
            ->get()
            ->each(fn (User $user) => $user->notify(new LoanNotification(
                'New public loan application received from '.$loan->borrower_name.'.',
                'public_application',
                true,
                [
                    'loan_id' => $loan->id,
                    'application_no' => $loan->application_no,
                ]
            )));

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
            'message' => 'Loan application submitted. Accounting will review your application.',
            'data' => new LoanApplicationResource(
                $loan->load('activityLogs.user', 'amortizations')
            ),
        ], 201);
    }

    public function show(LoanApplication $loanApplication)
    {
        $this->authorizeLoanAccess($loanApplication);

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
        $this->authorizeLoanAccess($loanApplication);

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
            $loanApplication->application_no.'.pdf'
        );
    }

    public function update(Request $request, LoanApplication $loanApplication)
    {
        $this->authorizeLoanAccess($loanApplication);

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
        LoanApplication $loanApplication,
        LoanDocumentService $loanDocumentService
    ) {
        $this->authorizeLoanAccess($loanApplication);

        $loanApplication = $loanDocumentService->generateDocuments($loanApplication);

        return response()->json([
            'success' => true,
            'message' => 'Loan documents generated successfully.',
            'data' => $loanApplication,
        ]);
    }

    public function uploadDocument(Request $request, LoanApplication $loanApplication, LoanDocumentService $loanDocumentService)
    {
        $this->authorizeLoanAccess($loanApplication);

        $data = $request->validate([
            'document_type' => [
                'required',
                'in:loan_application_form,authorization_to_deduct,promissory_note,supporting_documents',
            ],
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $document = $loanDocumentService->uploadSignedDocument(
            $loanApplication,
            $data['document_type'],
            $request->file('file')
        );

        return response()->json([
            'success' => true,
            'message' => 'Signed document uploaded.',
            'data' => $document,
        ]);
    }

    public function downloadDocument(LoanDocument $loanDocument, LoanDocumentService $loanDocumentService)
    {
        $loanDocument->load('loanApplication');
        abort_if(! $loanDocument->loanApplication, 404, 'Loan application not found.');

        $this->authorizeLoanAccess($loanDocument->loanApplication);

        if (! $loanDocumentService->exists($loanDocument)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found.',
            ], 404);
        }

        return $loanDocumentService->downloadDocument($loanDocument);
    }

    public function submitForEvaluation(
        LoanApplication $loanApplication,
        LoanDocumentService $loanDocumentService
    )
    {
        $this->authorizeLoanAccess($loanApplication);

        $requiredDocuments = $loanDocumentService->requiredDocumentTypes($loanApplication);

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

    public function approve(LoanApplication $loanApplication, LoanWorkflowService $loanWorkflowService)
    {
        $this->authorizeLoanManager();

        return $this->workflowResponse(
            $loanWorkflowService->approve($loanApplication, auth()->id())
        );
    }

    public function release(
        LoanApplication $loanApplication,
        LoanWorkflowService $loanWorkflowService
    ) {
        $this->authorizeLoanManager();

        return $this->workflowResponse(
            $loanWorkflowService->release($loanApplication, auth()->id())
        );
    }

    public function reject(Request $request, LoanApplication $loanApplication, LoanWorkflowService $loanWorkflowService)
    {
        $this->authorizeLoanManager();

        $data = $request->validate([
            'accounting_notes' => 'nullable|string|max:500',
        ]);

        return $this->workflowResponse(
            $loanWorkflowService->reject(
                $loanApplication,
                auth()->id(),
                $data['accounting_notes'] ?? null
            )
        );
    }

    public function review(
        LoanApplication $loanApplication,
        LoanWorkflowService $loanWorkflowService,
        LoanAccountService $loanAccountService
    )
    {
        $this->authorizeLoanManager();

        $result = $loanWorkflowService->review($loanApplication, auth()->id());

        if ($result['success'] ?? false) {
            $this->createBorrowerAccountIfNeeded($loanApplication, $loanAccountService);
        }

        return $this->workflowResponse($result);
    }

    private function createBorrowerAccountIfNeeded(
        LoanApplication $loanApplication,
        LoanAccountService $loanAccountService
    ): void {
        if ($loanApplication->member_id || ! $loanApplication->borrower_email) {
            return;
        }

        $loanData = $loanAccountService->attachBorrowerMember([
            'borrower_name' => $loanApplication->borrower_name,
            'borrower_email' => $loanApplication->borrower_email,
            'borrower_contact_number' => $loanApplication->borrower_contact_number,
            'borrower_address' => $loanApplication->borrower_address,
            'declared_member_status' => $loanApplication->declared_member_status,
            'loan_type' => $loanApplication->loan_type,
        ]);

        if (! empty($loanData['member_id'])) {
            $loanApplication->update([
                'member_id' => $loanData['member_id'],
                'is_coop_member' => $loanData['is_coop_member'] ?? false,
            ]);

            $memberUserId = Member::find($loanData['member_id'])?->user_id;
            $memberUser = $memberUserId ? User::find($memberUserId) : null;

            $memberUser?->notify(new LoanNotification(
                'Your borrower portal account is ready. Please check your email to set up your password.',
                'borrower_account_created',
                true,
                [
                    'loan_id' => $loanApplication->id,
                    'application_no' => $loanApplication->application_no,
                ]
            ));

            $loanApplication->activityLogs()->create([
                'user_id' => auth()->id(),
                'action' => 'account_created',
                'notes' => 'Borrower portal account was created or linked after accounting review. A password setup email was sent if this was a new account.',
            ]);
        }
    }

    public function dashboard(LoanDashboardService $loanDashboardService)
    {
        $this->authorizeLoanManager();

        return response()->json([
            'success' => true,
            'data' => $loanDashboardService->stats(),
        ]);
    }
}
