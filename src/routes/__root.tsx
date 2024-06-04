import {
    Link,
    Outlet,
    createRootRouteWithContext,
    useRouterState,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Spinner } from '../components/Spinner'

function RouterSpinner() {
    const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
    return <Spinner show={isLoading} />
}

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="flex items-center gap-2 border-b">
                    <h1 className="p-2 text-3xl">Todo App</h1>
                    <div className="text-3xl">
                        <RouterSpinner />
                    </div>
                </div>
                <div className="flex flex-1">
                    <div className="w-56 divide-y">
                        {(
                            [
                                ['/', '홈'],
                                ['/profile', '프로필'],
                                ['/login', '로그인'],
                            ] as const
                        ).map(([to, label]) => {
                            return (
                                <div key={to}>
                                    <Link
                                        to={to}
                                        activeOptions={
                                            {
                                                // If the route points to the root of it's parent,
                                                // make sure it's only active if it's exact
                                                // exact: to === '.',
                                            }
                                        }
                                        preload="intent"
                                        className="block px-3 py-2 text-blue-700"
                                        // Make "active" links bold
                                        activeProps={{ className: `font-bold` }}
                                    >
                                        {label}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex-1 border-l border-gray-200">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ReactQueryDevtools buttonPosition="top-right" />
        </>
    )
}
