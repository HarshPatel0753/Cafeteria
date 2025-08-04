<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CupListController;
use App\Http\Controllers\MobileDashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login-post', [AuthController::class, 'loginPost'])->name('login_post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
//for mobile dashboard
Route::prefix('home')->as('home')->middleware('auth:sanctum')->group(function () {
    Route::post('/load-cup-list-total', [MobileDashboardController::class, 'loadCupListTotal'])->name('total_cups');
    Route::get('/load-last-month-details', [MobileDashboardController::class, 'loadLastMonthDetails'])->name('last_month_details');
    Route::get('/load-last-7-days-record', [MobileDashboardController::class, 'loadLast7DaysRecord'])->name('load_last_7_days_record');
    Route::get('/chart-data', [MobileDashboardController::class, 'ChartData'])->name('chart_data');
});

Route::prefix('cup-list')->as('cup_list')->middleware('auth:sanctum')->group(function () {
    Route::post('/load-cup-list-data', [CupListController::class, 'loadData'])->name('load_data');
    Route::get('/load-vendor', [CupListController::class, 'getVendors'])->name('get_vendors');
    Route::post('/store-or-update/{cup_list_master?}', [CupListController::class, 'storeOrUpdate'])->name('store_or_update');
    Route::get('/get-products/{vendor}', [CupListController::class, 'getProducts'])->name('get_products');
    Route::get('/edit-cup-list/{id}', [CupListController::class, 'getCupList'])->name('edit_cup_list');
    Route::get('/destroy/{cup_list_master}', [CupListController::class, 'destroy'])->name('destroy');
});

Route::prefix('payment')->as('payment')->middleware('auth:sanctum')->group(function () {
    Route::get('/load-vendor', [PaymentController::class, 'getVendors'])->name('get_vendors');
    Route::post('/load-payments', [PaymentController::class, 'loadData'])->name('load_data');
    Route::post('/store-or-update/{payment?}', [PaymentController::class, 'storeOrUpdate'])->name('store_or_update');
    Route::get('/destroy/{payment}', [PaymentController::class, 'destroy'])->name('destroy');
});
Route::prefix('profile')->as('profile')->middleware('auth:sanctum')->group(function () {
    Route::get('/get-user/{user}', [UserController::class, 'getUser'])->name('get_user');
    Route::post('store-or-update/{user}', [UserController::class, 'storeOrUpdate'])->name('store_or_update');
    Route::post('/update-profile/{user}', [UserController::class, 'updateProfile'])->name('update_profile');
});

// Route::post('/myfun', [CupListController::class, 'myfun'])->name('myfun');
// Route::middleware([ 'middleware' =>'cors'])->group(function () {
//     Route::post('/load-cup-list-data', [CupListController::class, 'loadData'])->name('load_data');
//     Route::post('/login-post', [AuthController::class, 'loginPost'])->name('login_post');
// });
