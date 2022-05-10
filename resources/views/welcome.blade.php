@extends('layouts.app')
 
@section('content')
    <div class="header">
        <h1>TODO</h1>
        <img src="{{ asset('imgs/icon-moon.svg') }}" alt="Moon" class="moon" id="changeTheme"/>
    </div>
    <div class="input-area">
        <div class="dot"></div>
        <input type="text" name="todo" placeholder="Create a new todo..."/>
    </div>
    <div class="list-box">
        <ul class="list" id="todolist">
            @foreach($todos as $t)
            <li class="{{$t->status? 'done':'undone'}}" taskID="{{$t->id}}">
                <div class="dot"><div class="checked"></div></div>
                <div class="txt">{{Str::limit($t->task, 40) }}</div>
                <img src = "{{ asset('imgs/icon-cross.svg') }}" alt="My Happy SVG" class="del"/>
            </li>
            @endforeach
        </ul>
        <div class="list-bottom">
            <div><span id="counter"></span> items left</div>
            <div>
                <div class="filter hidden-sm">
                    <span class="link active " filter="all">All</span> 
                    <span class="link " filter="undone">Active</span> 
                    <span class="link " filter="done">Completed</span> 
                </div>
            </div>
            <div><span class="all" taskID="all">Clear Completed</span></div>
        </div>
    </div>
    <div class="mt-5 font-size-10 p-4 filter show-sm">
        <span class="link active" filter="all">All</span> 
        <span class="link" filter="undone">Active</span> 
        <span class="link" filter="done">Completed</span> 
    </div>
    <div class=" drag-and-drop-text">
        Drag and drop to reorder list
    </div>
@endsection