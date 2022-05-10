<?php

namespace App\Interfaces;

interface TodoRepositoryInterface 
{
    public function all(); // getting all tasks
    public function find($TodoId); // find task by id
    public function findBySort($SortId); // find task by sort id
    public function getBySort($SortId); //getiing task where is sorting id bigger than $sortId
    public function save($TodoData); //Save new  task to db
    public function update($TodoId); // update task's status
    public function updateSortId($TodoId,$SortId); // update sorting id
    public function incrementSort(); // increment all sorting id
    public function incrementSortId($TodoId,$FirstSortId,$lastSortId); // increment sorting id
    public function decrementSortId($TodoId,$FirstSortId,$lastSortId); // decrement sorting id
    public function delete($TodoId); // delete tasks
    public function deleteAllCompleted($TodoId); // delete all completed tasks
}