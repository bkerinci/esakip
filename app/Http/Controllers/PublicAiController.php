<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SmartAiService;
use Illuminate\Support\Facades\RateLimiter;

class PublicAiController extends Controller
{
    protected $smartAiService;

    public function __construct(SmartAiService $smartAiService)
    {
        $this->smartAiService = $smartAiService;
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $ip = $request->ip();

        // Rate limiting: 10 request per minute per IP for public
        if (RateLimiter::tooManyAttempts('public-ai-chat:' . $ip, 10)) {
            return response()->json([
                'response' => 'Terlalu banyak permintaan. AI sedang mendinginkan sistem, silakan coba lagi sebentar lagi.'
            ], 429);
        }

        RateLimiter::hit('public-ai-chat:' . $ip, 60);

        $response = $this->smartAiService->processChat($request->message);

        return response()->json([
            'response' => $response
        ]);
    }
}
