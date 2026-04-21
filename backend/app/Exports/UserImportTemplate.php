<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserImportTemplate implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles
{
    use Exportable;

    public function collection()
    {
        return collect([
            [
                'email' => 'Required. Valid format. E.g. john.doe@example.com',
                'first_name' => 'Required. E.g. John',
                'middle_name' => 'Optional. E.g. Robert',
                'last_name' => 'Required. E.g. Doe',
                'gender' => 'Required. male, female, others',
                'contact_number' => 'Optional. Starts with 09 or +639. E.g. 09123456789',
            ]
        ]);
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
        ];
    }

    public function map($row): array
    {
        return [
            $row['email'],
            $row['first_name'],
            $row['middle_name'],
            $row['last_name'],
            $row['gender'],
            $row['contact_number'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            2 => ['font' => ['italic' => true]],
        ];
    }
}
