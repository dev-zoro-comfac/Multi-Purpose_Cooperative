<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\PaginationHelper;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware; 

class NotificationController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    public function list(Request $request)
    {
        $validated = $request->validate([
            'unread'    => ['nullable', 'boolean'],
            'per_page'  => ['integer', 'gt:0'],
            'page'      => ['integer', 'gt:0']
        ]);

        $unreadOnly = $validated['unread'] ?? false;
        $perPage = $validated['per_page'] ?? PaginationHelper::DEFAULT_PER_PAGE;
        $page = $validated['page'] ?? PaginationHelper::DEFAULT_PAGE;

        $baseQuery = DatabaseNotification::query()->where('notifiable_id',  Auth::id());

        $unreadNotificationsCount = (clone $baseQuery)->unread()->count();

        $notifications = $baseQuery
            ->when($unreadOnly, fn($q) => $q->unread())
            ->latest()
            ->paginate(perPage: $perPage, page: $page);


        $notificationsResource = NotificationResource::collection($notifications)
            ->response()
            ->getData(true);

        return response()->json(
            [
                'success' => true,
                'message' => 'Notifications retrieved successfully.',
                'data' => $notificationsResource,
                'summary' => [
                    'unread_count' => $unreadNotificationsCount,
                ],
            ]
        );
    }

    public function overview(Request $request)
    {
        $validated = $request->validate([
            'unread' => ['nullable', 'boolean']
        ]);

        $unreadOnly = $validated['unread'] ?? false;
        $baseQuery = DatabaseNotification::query()->where('notifiable_id',  Auth::id());
        $unreadNotificationsCount = (clone $baseQuery)->unread()->count();

        $notifications = $baseQuery
            ->when($unreadOnly, fn($q) => $q->unread())
            ->latest()
            ->limit(15)
            ->get();

        $notificationsResource = NotificationResource::collection($notifications);

        return response()->json(
            [
                'success' => true,
                'message' => 'Notifications retrieved successfully.',
                'data' => $notificationsResource,
                'summary' => [
                    'unread_count' => $unreadNotificationsCount,
                ],
            ]
        );
    }

    public function read($notificationId)
    {
        $authenticatedUser = User::find(Auth::id());

        $notification = $authenticatedUser->notifications()->find($notificationId);

        if (!$notification) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Notification not found.',
                ],
                404
            );
        }

        $notification->markAsRead();

        return response()->json(
            [
                'success' => true,
                'message' => 'Notification marked as read successfully.',
            ]
        );
    }

    public function readAll()
    {
        $authenticatedUser = User::find(Auth::id());

        $authenticatedUser->unreadNotifications->markAsRead();

        return response()->json(
            [
                'success' => true,
                'message' => 'All notifications marked as read successfully.',
            ]
        );
    }

    public function delete($notificationId)
    {
        $authenticatedUser = User::find(Auth::id());

        $notification = $authenticatedUser->notifications()->find($notificationId);

        if (!$notification) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Notification not found.',
                ],
                404
            );
        }

        $notification->delete();

        return response()->json(
            [
                'success' => true,
                'message' => 'Notification deleted successfully.',
            ]
        );
    }

    public function deleteAll()
    {
        $authenticatedUser = User::find(Auth::id());

        $authenticatedUser->notifications()->delete();

        return response()->json(
            [
                'success' => true,
                'message' => 'All notifications deleted successfully.',
            ]
        );
    }
}
