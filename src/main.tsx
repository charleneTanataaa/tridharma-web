import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'sonner';
import './index.css';

createRoot(document.getElementById('root')!).render(  
    <StrictMode>
        <RouterProvider router={router}/>
        <Toaster richColors position='top-center' closeButton={true}/>
    </StrictMode>
)