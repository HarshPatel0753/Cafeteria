<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CupListFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "vendor_id" => "bail|required|numeric|exists:vendors,id",
            "entry_at"  => "required",
            "total_cups" => "numeric",
            "total_amount" => "numeric",
            "cup_list" => "bail|required",
            "cup_list.*.product_id" => "bail|required|numeric|exists:products,id",
            "cup_list.*.price" => "bail|required|numeric|min:1",
            "cup_list.*.cups"   => "bail|required|numeric|min:1"
        ];
    }

    public function attributes(): array
    {
        return [
            "cup_list.*.product_id" => "product",
            'cup_list.*.price' => "price",
            'cup_list.*.cups'   => "cups",
        ];
    }

    public function getFields(): array
    {
        $fields = [
            "vendor_id" =>  $this->vendor_id,
            "entry_at" => $this->entry_at,
            "total_cups" => $this->total_cups,
            "total_amount" => $this->total_amount,
            "remark" => $this->remark,
        ];

        if(empty($this->id)) {
            $fields['created_by'] = Auth::id();
        }

        return $fields;
    }

    public function getAction(): string
    {
        return empty($this->id) ? 'created' : 'updated';
    }
}
