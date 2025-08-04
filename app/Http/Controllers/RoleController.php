<?php

namespace App\Http\Controllers;

use App\Exports\RoleExport;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\RoleFormRequest;
use App\Imports\RolesImport;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\File;
use Illuminate\View\View;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    function index(): Response
    {
        return Inertia::render('role/Index');
    }
    function index1()
    {
        return View('index');
    }

    public function export()
    {
        return Excel::download(new RoleExport, 'role.xlsx');
    }

    public function import(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'role_file' => 'bail|file|mimes:xlsx'
            ]);

            $roles_import = new RolesImport();
            Excel::import($roles_import, $request->file('role_file'));


            DB::commit();
            return response()->json([
                'message' => 'Data Imported',
                'status' => $roles_import->getUPdatedOrCreatedCount(),
            ]);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'errors' => $e->failures(),
            ], status: 422);
        }
    }

    function loadData($per_page_number, $page_number): JsonResponse
    {
        try {
            DB::beginTransaction();
            $roles = Role::query()
                ->select(
                    'id',
                    'name',
                    'display_name'
                )
                ->paginate(perPage: $per_page_number, page: $page_number);
            // dd($roles->count());
            DB::commit();
            return response()->json($roles);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function storeOrUpdate(RoleFormRequest $request, Role $role): JsonResponse
    {
        try {
            DB::beginTransaction();

            $action = is_null($role->id) ? 'Created' : 'Updated';

            // store the role data in roles table
            $role->fill([
                'name' => $request->name,
                'display_name' => $request->display_name,
            ])->save();

            DB::commit();

            return response()->json([
                'message' => "Role - {$role->display_name} has been '{$action}' successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function destroy(Role $role): JsonResponse
    {
        try {
            DB::beginTransaction();

            // delete role records
            $role->delete();

            DB::commit();

            return response()->json([
                'message' => "Role - {$role->display_name} has been Deleted successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function testApi(): JsonResponse
    {
        return response()->json(['roles' => Role::all()]);
    }

    public function storeRole(Request $request): JsonResponse
    {
        $role = Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
        ]);

        return response()->json("'{$role->name}' role created.");
    }

    public function updateRole(Request $request): JsonResponse
    {
        $role = Role::where('id', $request->id)
            ->update(['name' => $request->name, 'display_name' => $request->display_name]);

        return response()->json("'{$role->name}' role updated.");
    }
}
