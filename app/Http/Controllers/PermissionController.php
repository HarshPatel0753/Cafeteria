<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    function index(): Response
    {
        return Inertia::render('permission/Index');
    }

    function loadData(): JsonResponse
    {

        try {
            DB::beginTransaction();

            $permissions = [];
            $all_roles = Role::with('permissions')->get();
            $permissions_list = Permission::with('roles')->get()->groupBy('category');
            foreach ($permissions_list as $category => $permission_list) {
                $permission_role = [];
                foreach ($permission_list as $permission) {
                    $roles = [];
                    foreach ($all_roles as $role) {
                        $roles[] = ["id" => $role->id, "has_permission" => $role->hasPermissionTo($permission->name)];
                    }
                    $permission_role[] = ["id" => $permission->id, "name" => $permission->display_name, "roles" => $roles];
                }
                $permissions[] = ["category" => $category, "permissions" => $permission_role];
            }

            DB::commit();

            return response()->json(['permissions' => $permissions, 'all_roles' => $all_roles]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function storeOrUpdate(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $role = Role::find($key);
            $role->syncPermissions($value);
        }
    }
}
