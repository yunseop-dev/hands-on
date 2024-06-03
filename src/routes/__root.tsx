import {
    Link,
    Outlet,
    createRootRouteWithContext,
    useRouterState,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth } from '../utils/auth'
import { Spinner } from '../components/Spinner'

function RouterSpinner() {
    const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
    return <Spinner show={isLoading} />
}

export const Route = createRootRouteWithContext<{
    auth: Auth
    queryClient: QueryClient
}>()({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="flex items-center border-b gap-2">
                    <h1 className="text-3xl p-2">Todo App</h1>
                    <div className="text-3xl">
                        <RouterSpinner />
                    </div>
                </div>
                <div className="flex-1 flex">
                    <div className="divide-y w-56">
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
                                        className="block py-2 px-3 text-blue-700"
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
