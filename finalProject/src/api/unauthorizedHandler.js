/**
 * Bridge between the axios layer and the authentication context.
 *
 * The axios response interceptor detects unexpected 401s, but it must never
 * mutate auth state itself (that would bypass UserContext and desynchronize
 * React state / localStorage / the React Query cache). Instead it notifies
 * the handler registered by UserContextProvider, which performs the ONE
 * canonical session teardown.
 */
let handler = null;

export function setUnauthorizedHandler(fn) {
  handler = typeof fn === 'function' ? fn : null;
}

export function notifyUnauthorized() {
  handler?.();
}
