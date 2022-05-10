<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    private static $sort = 0;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        return [
            'task' => "Call: ".$this->faker->name($gender),
            'status' => $this->faker->boolean(),
            'sort' => self::$sort++
        ];
    }
}
