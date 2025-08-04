<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleFormRequest extends FormRequest
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
            'name' => 'bail|required|string|alpha|unique:roles,name,' . $this->id,
            'display_name' => 'bail|required|string|alpha|unique:roles,display_name,' . $this->id,
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'display_name.regex' => 'The display name field must be a only alpha characters.',
            'name.regex' => 'The name field must be a only alpha characters.',
        ];
    }
}
