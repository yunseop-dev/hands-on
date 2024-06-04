import { createFileRoute, useNavigate, useRouter, useLayoutEffect } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm, SubmitHandler } from "react-hook-form"
import useLoginMutation from '../hooks/mutations/loginMutation'
import { LoginVariables } from '../types'
import useLocalStorage from '../hooks/useLocalStorage'

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
    component: LoginComponent,
})

export default function LoginComponent() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginVariables>({
        defaultValues: {
            // username: 'emilys',
            // password: 'emilyspass'
        }
    })
    const navigate = useNavigate();
    const [token, setToken] = useLocalStorage('token', '')
    const loginMutation = useLoginMutation()
    const onSubmit: SubmitHandler<LoginVariables> = (data) => {
        loginMutation.mutate(data, {
            onSuccess(data) {
                setToken(data.token);
                router.invalidate()
            }
        })
    }

    const router = useRouter()
    const search = Route.useSearch()

    useLayoutEffect(() => {
        if (token) {
            navigate({
                to: search.redirect ?? '/'
            })
        }
    }, [search.redirect, navigate, token])

    return token ? (
        <div>
            로그인 되었습니다.
            <div className="h-2" />
            <button
                onClick={() => {
                    setToken('')
                    router.invalidate()
                }}
                className="inline-block px-2 py-1 text-sm text-white bg-blue-500 border rounded"
            >
                로그아웃
            </button>
            <div className="h-2" />
        </div>
    ) : (
        <div className="p-2">
            <div>로그인 해주세요.</div>
            <div className="h-2" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>username</label>
                <input data-testid="email-input" type="text" className='block border' defaultValue="test" {...register("username")} />
                {errors.password && <span className='block text-red-500'>This field is required</span>}

                <label>password</label>
                <input data-testid="password-input" type="password" className='block border' {...register("password", { required: true })} />
                {errors.password && <span className='block text-red-500'>This field is required</span>}

                <button data-testid="login-button" type="submit">submit</button>
            </form>
        </div>
    )
}
