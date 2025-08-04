<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CupListController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Contracts\Role;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login-post', [AuthController::class, 'loginPost'])->name('login.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/export-demo-excel', [UserController::class, 'ExportDemoExcel'])->name('export_demo_excel');

Route::get('/unauthorized-page', function (Request $request) {
    return Inertia::render('Error', ['error' => $request->error]);
})->name('unauthorized_page');

Route::middleware(['auth'])->group(function () {

    Route::get('/test-page', function () {
        return Inertia::render('TestPage');
    })->name('/test_page')->middleware('role_or_permission:admin_dashboard');

    Route::as('dashboard.')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard');
        })->name('/')->middleware('role_or_permission:admin_dashboard');

        Route::post('dashboard/load-pie-chart', [ChartController::class, 'loadPieChartData'])->name('load_pie_chart');

        Route::get('dashboard/load-vendor-data', [ChartController::class, 'loadVendorData'])->name('load_vendor_data');

        Route::get('dashboard/load-dashboard-data', [ChartController::class, 'dashboardData'])->name('load_dashboard_data');
    });

    Route::prefix('user')->as('user.')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user.index')->middleware('role_or_permission:user_view');

        Route::post('store-or-update/{user?}', [UserController::class, 'storeOrUpdate'])->name('store_or_update')->middleware('role_or_permission:user_store|user_update');

        Route::get('destroy/{user}', [UserController::class, 'destroy'])->name('destroy')->middleware('role_or_permission:user_delete');

        Route::post('load-data', [UserController::class, 'loadData'])->name('load_data')->middleware('role_or_permission:user_view');

        Route::get('get-roles', [UserController::class, 'getRoles'])->name('get_roles')->middleware('role_or_permission:user_view');
    });

    Route::prefix('vendor')->as('vendor.')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [VendorController::class, 'index'])->name('index')->middleware('role_or_permission:vendor_view');

        Route::get('form', [VendorController::class, 'form'])->name('form')->middleware('role_or_permission:vendor_store');

        Route::post('store-or-update/{vendor?}', [VendorController::class, 'storeOrUpdate'])->name('store_or_update')->middleware('role_or_permission:vendor_store|vendor_update');

        Route::get('destroy/{vendor}', [VendorController::class, 'destroy'])->name('destroy')->middleware('role_or_permission:vendor_delete');

        Route::post('load-data/{per_page_number}/{page_number}', [VendorController::class,
        'loadData'])->name('load_data')->middleware('role_or_permission:vendor_view');

        Route::get('update-form/{id}', [VendorController::class, 'updateForm'])->name('update_form')->middleware('role_or_permission:vendor_update');

        Route::post('get-transactions', [VendorController::class, 'getTransactions'])->name('get_transactions')->middleware('role_or_permission:vendor_balance_view');

        Route::get('download-transactions/{id}', [VendorController::class, 'downloadTransactions'])->name('download_transactions')->middleware('role_or_permission:vendor_balance_pdf');

        Route::get('export-transaction/', [VendorController::class, 'transactionExport'])->name('transaction_export')->middleware('role_or_permission:vendor_balance_export');

        Route::post('importTransaction/', [VendorController::class, 'transactionImport'])->name('transaction_import')->middleware('role_or_permission:vendor_balance_import');
    });

    Route::prefix('cup-list')->as('cup_list')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [CupListController::class, 'index'])->name('index')->middleware('role_or_permission:cupList_view');

        Route::post('store-or-update/{cup_list_master?}', [CupListController::class, 'storeOrUpdate'])->name('store_or_update')->middleware('role_or_permission:cupList_store|cupList_update');

        Route::get('destroy/{cup_list_master}', [CupListController::class, 'destroy'])->name('destroy')->middleware('role_or_permission:cupList_delete');

        Route::get('get-vendors', [CupListController::class, 'getVendors'])->name('get_vendors');

        Route::get('get-products/{vendor}', [CupListController::class, 'getProducts'])->name('get_products');

        Route::post('load-data', [CupListController::class, 'loadDesktopData'])->name('load_data')->middleware('role_or_permission:cupList_view');

        Route::get('/edit-cup-list/{id}', [CupListController::class, 'getCupList'])->name('edit_cup_list');

        Route::get('/latest-cup-list', [CupListController::class, 'latestCupList'])->name('latest_cup_list');
    });

    Route::prefix('payment')->as('payment')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('index')->middleware('role_or_permission:payment_view');

        Route::post('load-data', [PaymentController::class, 'loadDesktopData'])->name('load_data')->middleware('role_or_permission:payment_view');

        Route::post('store-or-update/{payment?}', [PaymentController::class, 'storeOrUpdate'])->name('store_or_update')->middleware('role_or_permission:payment_store|payment_update');

        Route::get('destroy/{payment}', [PaymentController::class, 'destroy'])->name('destroy')->middleware('role_or_permission:payment_delete');

        Route::get('get-vendors', [PaymentController::class, 'getVendors'])->name('get_vendors')->middleware('permission:payment_view');

        Route::get('payment-pdf',[PaymentController::class,'getPdf'])->name('payment_pdf')->middleware('role_or_permission:payment_pdf');

        Route::get('export',[PaymentController::class,'export'])->name('export')->middleware('role_or_permission:payment_export');

        Route::post('import',[PaymentController::class,'import'])->name('import')->middleware('role_or_permission:payment_import');
    });

    Route::prefix('role')->as('role')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index')->middleware('role_or_permission:role_view');

        Route::post('load-data/{per_page_number}/{page_number}', [RoleController::class, 'loadData'])->name('load_data')->middleware('role_or_permission:role_view');

        Route::post('store-or-update/{role?}', [RoleController::class, 'storeOrUpdate'])->name('store_or_update')->middleware('role_or_permission:role_store|role_update');

        Route::get('destroy/{role}', [RoleController::class, 'destroy'])->name('destroy')->middleware('role_or_permission:role_delete');

        Route::get('export/', [RoleController::class, 'export'])->name('export');
        Route::post('import/', [RoleController::class, 'import'])->name('import');
    });

    Route::prefix('permission')->as('permission')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');

        Route::post('store-or-update', [PermissionController::class, 'storeOrUpdate'])->name('store_or_update');

        Route::post('load-data', [PermissionController::class, 'loadData'])->name('load_data');
    });

    Route::prefix('profile')->as('profile')->middleware(['role:admin|user'])->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');

        Route::get('/get-user/{user}', [UserController::class, 'getUser'])->name('get_user');

        Route::post('/update-profile/{user}', [UserController::class, 'updateProfile'])->name('update_profile');
    });
});
