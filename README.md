<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

# Todo App

## About the App

You can add, delete, reorder and checked as completed the tasks. 
I used simple approach to Solid design principle by using MVC and Service + Interface+ Repository pattern.
You can see some basic Unit test classes in test folder.

Used Techs:
- Laravel Framework 8.75
- Php 7.4 
- MySql
- Laravel Mix
- Jquery/Js
- Scss/Css
- Html
- Php Unit

### Some properties of the app
- Character limit to each task entry between 3 to 255 characters, 
- Task list showing max 40 chars in a line
- Custom alert on event, delete, over limit, marked as and not marked as completed.
- Auto focus on input area
- Toggle light and dark mode
- Drag and drop to reorder items on the list

After you clone the app to your local
* Rename .env.example to .env and modify it.
* Run ``` composer install ``` to install all dependencies
* Then migrate and seed the database
    ```php artisan migrate --seed```

### View Files:
    Layout: resources\views\layouts\app.blade.php
    Index: resources\views\welcome.blade.php
    Alert: resources\components\alert.blade.php

### CSS/JS
    Scss file: resources\css\responsive.scss
    Js file: resources\js\app.js
    Minified to 
    Css: public\css\app.css
    JS: public\js\app.js

### Controller
    App\Http\Controllers\TodoController.php

### Route
    routes\web.php

### Test File:
    tests/Feature/TodoTest.php 
    to run test file you can use "vendor\bin\phpunit"
