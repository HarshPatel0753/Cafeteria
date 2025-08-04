<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserFormRequest extends FormRequest
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
            'password' => 'bail|nullable|required_if:id,null|min:6',
            'confirm_password' => 'bail|nullable|required_if:id,null|same:password',
            'role_id' => 'bail|required|numeric',
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'password.required_if' => 'The password field is required.',
        ];
    }
}
