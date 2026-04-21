<?php

namespace App\Enums;

enum DateFormat: string
{
    case TIME_24H           = 'H:i:s';
    case TIME_24H_SHORT     = 'H:i';
    case TIME_12H           = 'h:i A';

    case DATE               = 'Y-m-d';
    case DATE_SLASH         = 'd/m/Y';
    case DATE_DOT           = 'd.m.Y';

    case DATETIME           = 'Y-m-d H:i:s';
    case DATETIME_SHORT     = 'Y-m-d H:i';
    case DATETIME_12H       = 'Y-m-d h:i A';

    case DATETIME_HUMAN_A   = 'M j, Y, g:i a';
}
