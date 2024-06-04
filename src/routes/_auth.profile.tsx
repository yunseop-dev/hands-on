import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/profile')({
    component: ProfileComponent,
})

function ProfileComponent() {
    return (
        <div className="p-2 space-y-2">
            <div>
                <a className='text-blue-400 underline' href="https://dummyjson.com/docs/auth#auth-me">/auth/me</a> API를 확인 후 사용자 정보를 보여주는 화면을 구현하세요.
            </div>
            <ul>
                <li>username:</li>
                <li>email:</li>
                <li>gender:</li>
            </ul>
        </div>
    )
}
