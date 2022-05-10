<?php
namespace App\Repositories;
use App\Models\Todo;
use App\Interfaces\todoRepositoryInterface;
class TodoRepository implements todoRepositoryInterface {
    protected $todo;
    
    public function __construct(Todo $todo)
    {
        $this->todo=$todo;
    }
    public function all(){
        return  $this->todo->select('id', 'task','status')->orderBy('sort','asc')->get(); // getting all tasks
    }
    public function find($TodoId)
    {
        $todo=$this->todo->find($TodoId);
        return $todo;
    }
    public function findBySort($SortId)
    {
        $todo=$this->todo->where('sort',$SortId)->first();
        return $todo;
    }
    public function getBySort($SortId)
    {
        $todos=$this->todo->select('id')->where('sort','>',$SortId)->orderBy('sort','asc')->get();
        return $todos;
    }
    public function save($TodoData) {
        $todo = $this->todo->create([
            'task' => $TodoData,
            'sort' => 0
        ]);
        return $todo;
    }
    public function update($TodoId)
    {
        $todo=$this->todo->find($TodoId);
        if($todo){
            $todo->status=$todo->status ? 0:1;
            $todo->save();
            return true;
        }
        return false;
    }
    public function updateSortId($TodoId, $SortId)
    {
        $todos=$this->todo->where('id', $TodoId)->update(['sort' => $SortId]);
        return $todos;
    }
    public function incrementSort()
    {
        $todo=$this->todo->increment('sort'); 
        return $todo;
    }
    public function incrementSortId($TodoId, $FirstSortId, $lastSortId)
    {
        $todo=$this->todo->where('id','!=',$TodoId)->where('sort','<',$FirstSortId)->where('sort','>=',$lastSortId)->increment('sort');
        return $todo;
    }
    public function decrementSortId($TodoId, $FirstSortId, $lastSortId)
    {
        $todo=$this->todo->where('id','!=',$TodoId)->where('sort','<=',$lastSortId)->where('sort','>',$FirstSortId)->decrement('sort');
        return $todo;
    }
    public function delete($TodoId) 
    {
        //We are using softdeletes, to check or retrieve tasks later.
        $todo=$this->todo->find($TodoId);
        $SortId=$todo->sort;
        $todo->delete();
        return $SortId;
    }
    public function deleteAllCompleted($TodoId)
    {
        $todos=$this->todo->where('status',1)->delete();
        return $todos;
    }
    
}