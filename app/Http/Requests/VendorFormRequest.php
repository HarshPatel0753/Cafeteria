<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorFormRequest extends FormRequest
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
            "name" => "bail|required|string",
            "mobile_number" => "bail|required|numeric|digits:10|unique:vendors,mobile_number," . $this->id,
            'email' => 'bail|required|email|unique:vendors,email,' . $this->id,
            'address' => 'bail|required|string',
            'gst_number' => 'bail|nullable|max:15|min:15|alpha_num',
            'delivery_persons.*.name' => 'string',
            'delivery_persons.*.mobile_number' => 'bail|numeric|digits:10|nullable',
            'products.*.name' => "bail|required|string",
            'products.*.price' => "bail|required|numeric|min:1",
        ];
    }

    public function messages(): array
    {
        return [
            'products.*.price' => 'The price field must be positive or atleast one.',
        ];
    }

    public function attributes(): array
    {
        return [
            'delivery_persons.*.name' => 'name',
            'delivery_persons.*.mobile_number' => 'mobile_number',
            'products.*.price' => 'price',
            'products.*.name' => 'name',
        ];
    }

    public function action(): string
    {
        return is_null($this->id) ? 'created' : 'updated';
    }

    public function fields(): array
    {
        $fields = [
            "name" => $this->name,
            "mobile_number" => $this->mobile_number,
            "email" => $this->email,
            "address" => $this->address,
            "gst_number" => $this->gst_number,
        ];
        return $fields;
    }

    public function filterDeliveryPersons(): array
    {
        $delivery_persons_ids = [];

        // store delivery persons id in array
        foreach ($this->delivery_persons as $delivery_person_id) {
            !is_null($delivery_person_id['id']) && array_push($delivery_persons_ids, $delivery_person_id['id']);
        }
        return $delivery_persons_ids;
    }

    public function filterProducts(): array
    {
        $products_ids = [];
        // store Request product id in array
        foreach ($this->products as $product_data_id) {
            (!is_null($product_data_id['id'])) && array_push($products_ids, $product_data_id['id']);
        }
        return $products_ids;
    }
}
