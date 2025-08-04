<?php

namespace App\Http\Controllers;

use App\Exports\DemoExport;
use App\Exports\RoleDemoExport;
use App\Http\Requests\UserFormRequest;
use App\Http\Requests\UserProfileFormRequest;
use App\Models\ProfileImage;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function ExportDemoExcel(){
        return Excel::download(new RoleDemoExport, 'demo.xlsx');
    }

    function index(): Response
    {
        return Inertia::render('user/Index');
    }

    //get user data from the users table
    function loadData(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $sortingColumns = $request->sorting_columns;
            $searchRows = $request->search_fields;

            $users = User::query()
            ->with(['roles:id,name,display_name'])
            ->select(
                'id',
                'username',
                'first_name',
                'last_name',
                'mobile_number',
                'email',
            )
            ->when($searchRows, function (Builder $query, array $searchRows) {
                foreach ($searchRows as $key => $value) {
                    $query->orWhere($value['name'] , 'LIKE' , "%".$value['text']."%");
                }
            })
            ->when($sortingColumns, function (Builder $query, array $sortingColumns) {
                foreach ($sortingColumns as $key => $value) {
                    $query->orderBy($key, $value);
                }
            })
            ->paginate(perPage: $request->per_page_number, page: $request->page_number);

            // dd($users->toArray());

            DB::commit();
            return response()->json($users);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    // function loadData(Request $request): JsonResponse
    // {
    //     try {
    //         DB::beginTransaction();

    //         $users = User::query()
    //             ->with(['roles:id,name,display_name'])
    //             ->select(
    //                 'id',
    //                 'username',
    //                 'first_name',
    //                 'last_name',
    //                 'mobile_number',
    //                 'email',
    //             )
    //             ->paginate(perPage: $request->per_page_number, page: $request->page_number);

    //         // dd($users->toArray());

    //         DB::commit();
    //         return response()->json($users);
    //     } catch (\Throwable $th) {
    //         DB::rollBack();
    //         throw $th;
    //     }
    // }

    function getUser(User $user)
    {
        try {

            $data = $user->only([
                'id',
                'username',
                'first_name',
                'last_name',
                'mobile_number',
                'email',
                'joining_date',
                'profile_image_path',
                'role_name',
            ]);

            $data['role_id'] = 0;

            return response()->json($data);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    function storeOrUpdate(UserFormRequest $request, User $user): JsonResponse
    {
        try {
            DB::beginTransaction();
            $action = is_null($user->id) ? 'Created' : 'Updated';
            // store the user data in users table
            $fields = [
                'username' => $request->username,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'mobile_number' => $request->mobile_number,
                'email' => $request->email,
            ];

            if (!empty($request->password)) {
                $fields['password'] = Hash::make($request->password);
            }

            $user->fill($fields)->save();

            $role = Role::findById($request->role_id);
            $user->syncRoles($role->name);

            DB::commit();

            return response()->json([
                'message' => "User - {$user->username} has been '{$action}' successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function destroy(User $user): JsonResponse
    {
        try {
            DB::beginTransaction();

            // delete user records
            $user->delete();

            DB::commit();

            return response()->json([
                'message' => "User - {$user->username} has been Deleted successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function getRoles()
    {
        try {
            DB::beginTransaction();

            $roles = Role::all()->select('id', 'display_name');

            DB::commit();
            return response()->json($roles);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    function userDataTable(): Response
    {
        return Inertia::render('UserDataTable');
    }

    public function updateProfile(User $user, UserProfileFormRequest $request)
    {

        try {
            DB::beginTransaction();

            $user->fill([
                'username' => $request->username,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'mobile_number' => $request->mobile_number,
                'email' => $request->email,
            ])->save();

            if ($request->file('profile_image_file')) {

                $profileImage = ProfileImage::where('user_id', $user->id)->first();

                if ($profileImage) {
                    Storage::delete('public'.$profileImage->path);
                }

                $rootPath = 'public/images/profile';
                $image = $request->file('profile_image_file');
                $extensionName = $image->getClientOriginalExtension();
                $imageFullName = time() . '-' . $user->first_name . '.' . $extensionName;

                Storage::putFileAs($rootPath, $image, $imageFullName);

                ProfileImage::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'path' => '/images/profile/' . $imageFullName,
                        'filename' => time() . '-' . $user->first_name,
                        'extension' => $extensionName,
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'message' => "User - {$user->username} profile has been 'updated' successfully.",
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
