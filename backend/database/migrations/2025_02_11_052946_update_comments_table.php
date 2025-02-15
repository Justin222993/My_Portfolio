<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCommentsTable extends Migration
{
    public function up()
    {
        // Drop the existing table
        Schema::dropIfExists('comments');

        // Recreate the table with new columns (google_user_id, comment, name, photo, approved)
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('google_user_id');
            $table->string('name');
            $table->string('photo');
            $table->text('comment');
            $table->boolean('approved')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        // Drop the table if we roll back the migration
        Schema::dropIfExists('comments');
    }
}

