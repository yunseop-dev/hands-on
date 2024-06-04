// reference: https://github.com/TanStack/router/discussions/604
import { Outlet, RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { PropsWithChildren } from 'react'

export default function TestRouter({ children }: PropsWithChildren) {
    const rootRoute = createRootRoute({
        component: Outlet,
    });

    const componentRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: () => children,
    });

    const router = createRouter({
        routeTree: rootRoute.addChildren([componentRoute]),
        history: createMemoryHistory(),
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <RouterProvider router={router} />;
}