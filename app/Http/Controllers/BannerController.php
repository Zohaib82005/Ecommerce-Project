<?php

namespace App\Http\Controllers;

use App\Models\HomeBanner;
use App\Models\PromotionBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'badge' => 'nullable|string|max:120',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0|max:9999',
            'is_active' => 'nullable|boolean',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $imagePath = $request->file('image')->store('home-banners', 'public');

        HomeBanner::create([
            'badge' => $data['badge'] ?? null,
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'description' => $data['description'] ?? null,
            'button_text' => $data['button_text'] ?? 'Shop Now',
            'button_link' => $data['button_link'] ?? '#',
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Banner uploaded successfully.');
    }

    public function destroy($id)
    {
        $banner = HomeBanner::find($id);

        if (!$banner) {
            return redirect()->back()->with('error', 'Banner not found.');
        }

        if (!empty($banner->image) && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return redirect()->back()->with('success', 'Banner deleted successfully.');
    }

    public function storePromotion(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0|max:9999',
            'is_active' => 'nullable|boolean',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $imagePath = $request->file('image')->store('promotion-banners', 'public');

        PromotionBanner::create([
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'button_link' => $data['button_link'] ?? '#',
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Promotion banner uploaded successfully.');
    }

    public function destroyPromotion($id)
    {
        $banner = PromotionBanner::find($id);

        if (!$banner) {
            return redirect()->back()->with('error', 'Promotion banner not found.');
        }

        if (!empty($banner->image) && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return redirect()->back()->with('success', 'Promotion banner deleted successfully.');
    }
}
