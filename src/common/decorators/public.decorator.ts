import { SetMetadata } from '@nestjs/common';

// Marks a route as public (no JWT needed). Everything else is protected by default.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
