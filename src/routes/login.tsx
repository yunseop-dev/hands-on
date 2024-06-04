import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
    component: LoginComponent,
})

function LoginComponent() {
    const router = useRouter()
    const { auth, status } = Route.useRouteContext({
        select: ({ auth }) => ({ auth, status: auth.status }),
    })
    const search = Route.useSearch()
    const [username, setUsername] = React.useState('')

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        auth.login(username)
        router.invalidate()
    }

    // Ah, the subtle nuances of client side auth. 🙄
    React.useLayoutEffect(() => {
        if (status === 'loggedIn' && search.redirect) {
            router.history.push(search.redirect)
        }
    }, [status, search.redirect])

    return status === 'loggedIn' ? (
        <div>
            <strong>{auth.username}</strong>으로 로그인 되었습니다.
            <div className="h-2" />
            <button
                onClick={() => {
                    auth.logout()
                    router.invalidate()
                }}
                className="text-sm bg-blue-500 text-white border inline-block py-1 px-2 rounded"
            >
                로그아웃
            </button>
            <div className="h-2" />
        </div>
    ) : (
        <div className="p-2">
            <div>로그인 해주세요.</div>
            <div className="h-2" />
            <form onSubmit={onSubmit} className="flex gap-2">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="border p-1 px-2 rounded"
                />
                <button
                    type="submit"
                    className="text-sm bg-blue-500 text-white border inline-block py-1 px-2 rounded"
                >
                    로그인
                </button>
            </form>
        </div>
    )
}
