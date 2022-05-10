<?php

namespace App\Services;
use App\Interfaces\TodoRepositoryInterface;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
class TodoService {

    protected $todoRepository;
    const ALL = "all";

    public function __construct(TodoRepositoryInterface $todoRepository) 
    {
        $this->todoRepository=$todoRepository;
    }
    public function getAllTodoData(){ // getting all tasks
        $result=$this->todoRepository->all();
        return $result;
    }
    public function saveTodoData($TodoData):bool
    {
        $response=DB::transaction(function () use ($TodoData) {
            $this->todoRepository->incrementSort();  //The order of the other tasks will increase by one, as a new task is added to the first line.
            $todo=$this->todoRepository->save($TodoData['task']);
            if(!$todo){
                throw new \Exception('Task not created');
            }
            return true;
        });
        return $response;
    }

    public function updateTodoData($TodoId){ // Updating task's status
        
       /* $validator=Validator::make(['id'=>$TodoId], ['id'=>'integer|required']);
       
        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first()."$TodoId ---");
        }*/
        $result=$this->todoRepository->update($TodoId);
        return $result;
    }

    public function deleteTodoData($TodoId){ // delete tasks
        /*$validator=Validator::make(['id'=>$TodoId], ['id'=>'required']);
        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }*/
        //We are using softdeletes, to check or retrieve tasks later.
        if($TodoId==self::ALL){
            //"Clear Completed"
            $result=$this->todoRepository->deleteAllCompleted($TodoId);
            $this->reSort(self::ALL);
        } else {
            $result=$this->todoRepository->delete($TodoId);
            $this->reSort($result);
        }
        return $result;
    }

    public function sortTodoData($TodoData){ // Sorting Tasks

       /* $validator=Validator::make($TodoData, ['newIndex'=>'integer|required','oldIndex'=>'integer|required']);
        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }*/

        $newIndex=$TodoData['newIndex']; 
        $oldIndex=$TodoData['oldIndex'];
        if($newIndex==$oldIndex) { return false; } // if there is position change return false
        
        $todo=$this->todoRepository->findBySort($oldIndex); // get the moving task object
        if($todo){
            DB::transaction(function () use ($todo,$newIndex,$oldIndex) {
                //we are just getting and arranging tasks which are positions changed
                if($newIndex<$oldIndex){
                    $this->todoRepository->incrementSortId($todo->id,$oldIndex,$newIndex);
                } else {
                    $this->todoRepository->decrementSortId($todo->id,$oldIndex,$newIndex);
                }
                //Update the task sort number
                $this->todoRepository->updateSortId($todo->id,$newIndex);
            });
            return true;
        }
        return false;
        
    }

    //When a task is deleted, this function reorders
    public function reSort($sort_start=0)
    {
        $sortId=-1; //sorting starting from 0
        if($sort_start!=self::ALL) {
            $sortId=$sort_start;
        }
        $todos=$this->todoRepository->getBySort($sortId);
        foreach($todos as $todo){
            $result=$this->todoRepository->updateSortId($todo->id,$sortId);
            $sortId++;
        }
    }

}