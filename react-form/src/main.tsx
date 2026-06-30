/*
 * This is the actual application itself
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StrictMode>
            <UserProvider>
                <App />
            </UserProvider>
        </StrictMode>
    </BrowserRouter>
)
