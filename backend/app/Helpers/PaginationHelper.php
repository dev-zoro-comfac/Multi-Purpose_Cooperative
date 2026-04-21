<?php

namespace App\Helpers;


class PaginationHelper
{
    public const DEFAULT_PAGE = 1;
    public const DEFAULT_PER_PAGE = 20;

    /**
     * Clamp the per-page value between 1 and a given max page size.
     *
     * @param int $perPage Requested page size
     * @param int $maxPageSize Optional max limit (default: 100)
     * @return int Sanitized page size
     */
    public static function sanitizePageSize(
        int $perPage = 20,
        int $maxPerPage = 100
    ): int {
        return max(1, min($perPage, $maxPerPage));
    }
}
