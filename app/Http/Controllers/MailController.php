<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationMail;
use App\Models\User;
class MailController extends Controller
{
    public function sendEmail()
    {
        $otp = session()->put('otp', rand(100000, 999999));
        // dd(session('otp'));
        Mail::to(session('email'))->send(new VerificationMail(session('otp')));
        return redirect('/verify/otp');
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        if ($request->code == session('otp')) {
            session()->forget('otp');
            User::where('email', session('email'))->update(['email_verified_at' => now()]);
            session()->forget('email');
            return redirect('/login')->with('success', 'Email verified successfully!');
        } else {
            return redirect()->back()->with('error', 'Invalid OTP');
        }
    }
}
