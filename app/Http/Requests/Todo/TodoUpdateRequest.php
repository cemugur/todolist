<?php

namespace App\Http\Requests\todo;

use Illuminate\Foundation\Http\FormRequest;

class TodoUpdateRequest extends FormRequest
{
    protected $id;
    
    public function __construct($id)
    {
        $this->id = $id;
    }
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        
        return [
            'id'=>'integer|required'
        ];
    }
}
