<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use App\Models\Todo;
class TodoTest extends TestCase
{
    //we are testing if there is a problem on the home page
    public function test_index_function()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
    //Creating new task with TodoController->store function
    public function create_a_new_task()
    {
        $request = Request::create('/store', 'POST',[
            'task'     =>  'Test task',
            'status'  =>  '0',
        ]);
        $response=($this->app->make('App\Http\Controllers\TodoController'))->store($request);
        return $response;
    }
    //we are testing if there is a problem on store function
    public function test_create_a_new_task()
    {
        $response=$this->create_a_new_task();
        $this->assertEquals(
            '200',
            $response->getData()->status,
            "OK -> Status 200"
        );
        $this->assertEquals(
            true,
            $response->getData()->data,
            "OK -> task created"
        );
    }

    //we are testing if there is a problem on marked as completed or undo
    public function test_checked_or_unchecked_tasks()
    {
        $todo = Todo::where('status',0)->first();
        if($todo){
            $todo = Todo::factory()->create([
                'task' => 'Factory Task',
                'status'=>0
            ]);
        } 
        $response=($this->app->make('App\Http\Controllers\TodoController'))->update($todo->id);
        $this->assertEquals(
            '200',
            $response->getData()->status,
            "OK -> Status 200"
        );
        $this->assertEquals(
            true,
            $response->getData()->data,
            "OK -> Status Changed"
        );
        $this->assertNotNull($todo);
    }
  //we are testing if there is a problem on  deleting single task
    public function test_delete_single_task(){
        $todo = Todo::first();
        $task_id=$todo->id;
        $response = $response=($this->app->make('App\Http\Controllers\TodoController'))->destroy($task_id);
        $this->assertEquals(
            '200',
            $response->getData()->status,
            "OK -> Status 200"
        );
        $result=false;
        if($response->getData()->data){
            $result=true;
        }
        $this->assertTrue($result,'Task deleted');
       
        $this->assertDatabaseHas('todos', [
            'id' => $task_id,
        ]);
    }
      //we are testing if there is a problem on  clearing all completed tasks
    public function test_delete_clear_completed_task(){
        $todo = Todo::first();
        $response = $response=($this->app->make('App\Http\Controllers\TodoController'))->destroy('all');
        
        $this->assertEquals(
            '200',
            $response->getData()->status,
            "OK -> Status 200"
        );
        $result=false;
        if($response->getData()->data){
            $result=true;
        }
        $this->assertTrue($result,'Task deleted');
        $this->assertDatabaseHas('todos', [
            'status' => 1,
        ]);
    }
}


