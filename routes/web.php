<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::controller(TodoController::class)->group(function () {
    Route::GET('/', 'index');
    Route::POST('/todo', 'store');
    Route::PUT('/todo', 'sort');
    Route::PATCH('/todo/{id}', 'update');
    Route::DELETE('/todo/{id}', 'destroy');
});
