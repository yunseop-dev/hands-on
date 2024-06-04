import { it, describe, vi, expect, } from 'vitest'
import App from '../routes/login'
import { render, screen, userEvent, waitFor } from '../lib/test-utils';
import TestRouter from './utils/TestRouter'
import { loginResponse } from '../mocks/handlers';
import * as remotes from '../lib/remotes';
import * as router from '@tanstack/react-router'

describe('로그인 페이지', () => {
    it('에서는 이메일, 비밀번호, 로그인 버튼이 존재합니다.', async () => {
        render(
            <TestRouter>
                <App />
            </TestRouter>
        );

        await screen.findByTestId<HTMLInputElement>('email-input');
        await screen.findByTestId<HTMLInputElement>('password-input');
        await screen.findByTestId<HTMLButtonElement>('login-button');
    })

    it('에서는 유효성 검증을 진행합니다.', async () => {
        render(
            <TestRouter>
                <App />
            </TestRouter>
        );

        const loginBtn = await screen.findByTestId<HTMLButtonElement>('login-button');

        await userEvent.click(loginBtn);
        const arr = await screen.findAllByText<HTMLSpanElement>('This field is required')
        expect(arr.length).toBe(2);
    })

    it('에서 로그인이 성공하면, 페이지를 이동합니다.', async () => {
        vi.spyOn(remotes, 'login').mockResolvedValue(loginResponse)
        const mockNavigate = vi.fn();
        vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate)

        render(
            <TestRouter>
                <App />
            </TestRouter>
        );

        const loginBtn = await screen.findByTestId<HTMLButtonElement>('login-button');
        const email = await screen.findByTestId<HTMLInputElement>('email-input');
        const password = await screen.findByTestId<HTMLInputElement>('password-input');

        await userEvent.type(email, 'emilys');
        await userEvent.type(password, 'emilyspass');
        await userEvent.click(loginBtn);
        await waitFor(() => expect(mockNavigate).toBeCalledWith({
            to: '/',
        }));
    })
})
