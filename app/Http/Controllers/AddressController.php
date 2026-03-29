<?php

namespace App\Http\Controllers;

use App\Models\Addresse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Store a new address for the authenticated user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'landmark' => 'nullable|string|max:255',
        ]);

        $address = Addresse::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['area'],
            'province' => $validated['location'],
            'landmark' => $validated['landmark'],
            'country' => $validated['country'],
        ]);

        // if ($request->expectsJson()) {
        //     return response()->json($address, 201);
        // }

        return back()->with('success', 'Address Added Successfully');
    }

    /**
     * Get all addresses for the authenticated user
     */
    public function index()
    {
        $addresses = Addresse::where('user_id', auth()->id())
            ->select(['id', 'name', 'phone', 'address', 'city', 'province', 'country', 'landmark'])
            ->get();
        return response()->json($addresses);
    }

    /**
     * Update an address
     */
    public function update(Request $request, $id)
    {
        $address = Addresse::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'landmark' => 'nullable|string|max:255',
        ]);

        $address->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['area'],
            'province' => $validated['location'],
            'landmark' => $validated['landmark'],
            'country' => $validated['country'],
        ]);

        // if ($request->expectsJson()) {
        //     return response()->json($address, 200);
        // }

        return back()->with('success', 'Address Updated Successfully');
    }

    /**
     * Delete an address
     */
    public function destroy(Request $request, $id)
    {
        $address = Addresse::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $address->delete();

        // if ($request->expectsJson()) {
        //     return response()->json(['message' => 'Address Deleted Successfully'], 200);
        // }

        return back()->with('success', 'Address Deleted Successfully');
    }
}
