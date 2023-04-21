import { dev } from '$app/environment';

export const ssr = false;
export const prerender = true;
export const trailingSlash = dev ? 'never' : 'always';
