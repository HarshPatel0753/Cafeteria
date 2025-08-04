<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginFormPostRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

use function Laravel\Prompts\error;

class AuthController extends Controller
{
    function login(): Response
    {
        return Inertia::render('Login');
    }

    function  loginPost(LoginFormPostRequest $request): JsonResponse
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $token = auth()->user()->createToken('auth_token')->plainTextToken;
            return response()->json([
                'userData'=>auth()->user(),
                'message' => 'Login Success',
                'isValid'=> true,
                'token' => $token,
            ]);
        }

        return response()->json([
            // 'status' => 'error',
            'isValid'    => false,
            'message' => 'These credentials does not match our records.'
        ]);
    }

    public function logout(): Response
    {
        if (Auth::check()) {
            Auth::logout();
            Session()->flush();
            Session()->regenerate();
            return Inertia::render('Login');
        }
        return Inertia::render('Login');
    }
}
