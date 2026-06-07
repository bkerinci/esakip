<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::latest()->paginate(20);
        
        return Inertia::render('Feedback/Index', [
            'feedbacks' => $feedbacks
        ]);
    }

    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        
        return redirect()->back()->with('success', 'Feedback berhasil dihapus.');
    }
}
