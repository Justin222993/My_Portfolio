<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'title',
        'description',
        'skills_required',
        'date',
        'photo',
        'secondary_photo',
    ];

    protected $dates = [
        'date',
    ];
}
