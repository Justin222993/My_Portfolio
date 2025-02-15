<?php

use App\Models\Comment;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

# COMMENTS--------------------

Route::post('/comment', function (Request $request) {

    $request->validate([
        'google_user_id' => 'required|string',
        'name' => 'required|string',
        'photo' => 'required|string',
        'comment' => 'required|string',
    ]);

    $comment = Comment::create([
        'google_user_id' => $request->google_user_id,
        'name' => $request->name,
        'photo' => $request->photo,
        'comment' => $request->comment,
        'approved' => false,
    ]);

    return response()->json(['message' => 'Comment submitted for approval!', 'comment' => $comment], 201);
});

// New route to fetch all comments
Route::get('/approvedComments', function () {
    $comments = Comment::where('approved', true)->get();
    return response()->json($comments);
});

Route::get('/unApprovedComments', function () {
    $comments = Comment::where('approved', false)->get();
    return response()->json($comments);
});

Route::put('/approveComment/{id}', function ($id) {

    $comment = Comment::find($id);

    if (!$comment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    $comment->approved = true;
    $comment->save();

    return response()->json(['message' => 'Comment approved!', 'comment' => $comment]);
});

Route::delete('/deleteComment/{id}', function ($id) {

    $comment = Comment::find($id);

    if (!$comment) {
        return response()->json(['message' => 'Comment not found'], 404);
    }

    $comment->delete();

    return response()->json(['message' => 'Comment deleted successfully']);
});

# PROJECTS--------------------

Route::post('/project', function (Request $request) {
    // Validate the request
    $request->validate([
        'title' => 'required|string',
        'description' => 'required|string',
        'skills_required' => 'required|string',
        'date' => 'required|date',
        'photo' => 'required|image', // Ensure the photo is an image
        'secondary_photo' => 'nullable|image', // Secondary photo is optional
    ]);

    // Handle image upload for the project
    $photoPath = $request->file('photo')->store('project_photos', 'public'); // Store in public disk
    $secondaryPhotoPath = $request->file('secondary_photo') ? $request->file('secondary_photo')->store('project_photos', 'public') : null;

    // Create the project
    $project = Project::create([
        'title' => $request->title,
        'description' => $request->description,
        'skills_required' => $request->skills_required,
        'date' => $request->date,
        'photo' => $photoPath,
        'secondary_photo' => $secondaryPhotoPath,
    ]);

    return response()->json([
        'message' => 'Project created successfully!',
        'project' => $project,
    ], 201);
});

// Route to get all projects
Route::get('/projects', function () {
    $projects = Project::all();
    return response()->json($projects);
});

// Route to get a single project by ID
Route::get('/project/{id}', function ($id) {
    $project = Project::find($id);

    if (!$project) {
        return response()->json(['message' => 'Project not found'], 404);
    }

    return response()->json($project);
});

// Route to update an existing project
Route::put('/project/{id}', function (Request $request, $id) {
    // Log the incoming request data for debugging
    \Log::info('Update request received for project ID: ' . $id);
    \Log::info('Request data: ', $request->all());

    $project = Project::find($id);

    if (!$project) {
        return response()->json(['message' => 'Project not found'], 404);
    }

    // Manually validate the request data
    $validator = Validator::make($request->all(), [
        'title' => 'required|string',
        'description' => 'required|string',
        'skills_required' => 'required|string',
        'date' => 'required|date',
        'photo' => 'nullable|image',
        'secondary_photo' => 'nullable|image',
    ]);

    if ($validator->fails()) {
        \Log::error('Validation failed: ', $validator->errors()->toArray());
        return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
    }

    // Handle image upload if present
    if ($request->hasFile('photo')) {
        $photoPath = $request->file('photo')->store('project_photos', 'public');
        $project->photo = $photoPath;
    }
    if ($request->hasFile('secondary_photo')) {
        $secondaryPhotoPath = $request->file('secondary_photo')->store('project_photos', 'public');
        $project->secondary_photo = $secondaryPhotoPath;
    }

    // Update project fields
    $project->title = $request->title;
    $project->description = $request->description;
    $project->skills_required = $request->skills_required;
    $project->date = $request->date;

    $project->save();

    \Log::info('Project updated successfully: ', $project->toArray());
    return response()->json(['message' => 'Project updated successfully!', 'project' => $project]);
});

// Route to delete a project
Route::delete('/project/{id}', function ($id) {
    try {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Optionally delete the images if you want
        if ($project->photo) {
            $photoPath = storage_path('app/public/' . $project->photo);
            if (file_exists($photoPath)) {
                unlink($photoPath); // Deletes the uploaded photo
            } else {
                Log::warning("Photo file not found: {$photoPath}");
            }
        }
        if ($project->secondary_photo) {
            $secondaryPhotoPath = storage_path('app/public/' . $project->secondary_photo);
            if (file_exists($secondaryPhotoPath)) {
                unlink($secondaryPhotoPath); // Deletes the secondary photo
            } else {
                Log::warning("Secondary photo file not found: {$secondaryPhotoPath}");
            }
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    } catch (\Exception $e) {
        Log::error("Error deleting project: {$e->getMessage()}");
        return response()->json(['message' => 'Internal Server Error'], 500);
    }
});
