import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import CreateNote from './pages/CreateNote'
import AdminRoute from './privateroutes/AdminRoute'
import StudentRoute from './privateroutes/StudentRoute'

import Register from './pages/Register'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminRoute />}>
                    <Route element={<Register />} path='/admin/create' exact />
                    <Route element={<AdminHome />} path='/admin' exact />
                </Route>
                <Route element={<StudentRoute />}>
                    <Route
                        element={<CreateNote />}
                        path='/notes/create'
                        exact
                    />
                </Route>
                <Route exact path='/' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
