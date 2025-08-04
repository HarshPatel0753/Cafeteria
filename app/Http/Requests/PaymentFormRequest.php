<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PaymentFormRequest extends FormRequest
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
            "payment_at" => "required",
            "type" => "bail|required",
            "amount" => "bail|required|numeric|min:1",
        ];
    }

    public function action():string
    {
        return is_null($this->id) ? "created" : "updated";
    }

    public function fields():array
    {
        $fields = [
            "vendor_id" => $this->vendor_id,
            "payment_at" => Carbon::parse($this->payment_at)->format('y-m-d h:m:s'),
            "type" => $this->type,
            "amount" => $this->amount,
            "remark" => $this->remark,
        ];
        is_null($this->id) && $fields["created_by"] = Auth::user()->id;
        return $fields;
    }
}
