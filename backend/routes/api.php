<?php

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/comment', function (Request $request) {
    $request->validate([
        'google_user_id' => 'required|string',
        'comment' => 'required|string',
    ]);

    $comment = Comment::create([
        'google_user_id' => $request->google_user_id,
        'comment' => $request->comment,
        'approved' => false,
    ]);

    return response()->json(['message' => 'Comment submitted!', 'comment' => $comment], 201);
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
