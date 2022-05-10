<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ToDo App</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="{{ asset('css/app.css') }}?{{rand()}}" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    </head>
    <body class="light">
        <div class="container">
            @yield('content')
        </div>
        <x-alert />
        <script>
            $(document).ready(function() {
                $.getScript("{{ asset('js/app.js') }}");
                $( "input" ).focus();
                $('#counter').html($('.undone').length); 
            });
        </script>
    </body>
</html>