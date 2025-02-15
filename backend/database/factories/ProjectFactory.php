<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'skills_required' => $this->faker->word,
            'date' => $this->faker->date,
            'photo' => $this->faker->imageUrl(),
            'secondary_photo' => $this->faker->imageUrl(),
        ];
    }
}
