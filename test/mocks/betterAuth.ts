import { auth } from '../utils/auth.test';

export const ctx = await auth.$context;
export const test = ctx.test;
