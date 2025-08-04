<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserProfileFormRequest extends FormRequest
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
        $rules = [
            'username' => 'bail|required|string|unique:users,username,' . $this->id,
            'first_name' => 'bail|required|string|alpha',
            'last_name' => 'bail|required|string|alpha',
            'mobile_number' => 'bail|required|numeric|digits:10',
            'email' => [
                'bail',
                'required',
                'email',
                'unique:users,email,' . $this->id,
            ],
        ];

        return $rules;
    }
}
