import './index.css'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  ErrorComponent,
  createRouter,
} from '@tanstack/react-router'
import { Spinner } from './components/Spinner'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'

export const queryClient = new QueryClient()

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="p-2 text-2xl">
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  // This stuff is just to tweak our sandbox setup in real-time
  return (
    <>
      <RouterProvider
        router={router}
        defaultPreload="intent"
      />
    </>
  )
}

enableMocking().then(() => {
  const rootElement = document.getElementById('root')!
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>,
      </StrictMode>
    )
  }
})