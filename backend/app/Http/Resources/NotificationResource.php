<?php

namespace App\Http\Resources;

use App\Helpers\DateHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'read_at'       => $this->read_at,
            'data'          => $this->data,
            'read_on'       => $this->read_at?->diffForHumans(),
            'created_at'    => DateHelper::toISo8601String($this->created_at),
            'created_on'    => $this->created_at->diffForHumans(),
        ];
    }
}
