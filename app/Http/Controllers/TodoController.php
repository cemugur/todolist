<?php
namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Bus\Batch;
use App\Services\TodoService;
use Exception;
use App\Http\Requests\Todo\TodoSaveRequest;
use App\Http\Requests\Todo\TodoUpdateRequest;
use App\Http\Requests\Todo\TodoDeleteRequest;
use App\Http\Requests\Todo\TodoSortRequest;
class TodoController extends Controller
{
 
    protected $service;
    
    public function __construct(TodoService $service)
    {
        $this->service=$service;
    }
    
    //Displaying todo list page
    public function index()
    {
        $todos=$this->service->getAllTodoData();
       
        return view('welcome',compact('todos'));
    }

    //Creating new task
    public function store(TodoSaveRequest $request)
    {
        $result=['status'=>200];
        try {
            $data=$request->validated();
            $result['data']=$this->service->saveTodoData($data);
        } catch (Exception $e) {
            $result =[
                'status'=>500,
                'error'=>$e->getMessage()
            ];
        }
        return response()->json($result,$result['status']);
    }
    //When the user clicks the completed button, the status will be 0 if it is checked before, 1 if it is not.
    public function update($id)
    {
        
        $result=['status'=>200];
        try {
            $request= new TodoUpdateRequest($id); // send $id variable to form request validation
            $result['data']=$this->service->updateTodoData($id);
        } catch (Exception $e) {
            $result =[
                'status'=>500,
                'error'=>$e->getMessage()
            ];
        }
        return response()->json($result,$result['status']);
    }

    
    // Delete a single task or delete all completed tasks
    public function destroy($id)
    {
        $result=['status'=>200];
        try {
            $request= new TodoDeleteRequest($id); // send $id variable to form request validation
            $result['data']=$this->service->deleteTodoData($id);
        } catch (Exception $e) {
            $result =[
                'status'=>500,
                'error'=>$e->getMessage()
            ];
        }
        return response()->json($result,$result['status']);

       
    }


    //Getting first and last index of the task and resort others 
    public function sort(TodoSortRequest $request)
    {
        
        $result=['status'=>200];
        try {
            $data=$request->validated();
            $result['data']=$this->service->sortTodoData($data);
        } catch (Exception $e) {
            $result =[
                'status'=>500,
                'error'=>$e->getMessage()
            ];
        }
        return response()->json($result,$result['status']);

        
    }
}