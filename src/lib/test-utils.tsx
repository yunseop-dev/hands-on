import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { Suspense } from 'react'

function customRender(ui: React.ReactElement, options = {}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // ✅ turns retries off
                retry: false,
            },
        },
    })

    return render(ui, {
        // wrap provider(s) here if needed
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </QueryClientProvider>,
        ...options,
    })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }