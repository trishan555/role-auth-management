import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/Admin/AdminHome'
import CreateNote from './pages/Student/CreateNote'
import AdminRoute from './privateroutes/AdminRoute'
import StudentRoute from './privateroutes/StudentRoute'
import UpdateUser from './pages/Student/UpdateUser'

import Register from './pages/Register'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminRoute />}>
                    <Route path='/admin/create' exact element={<Register />} />
                    <Route path='/admin' exact element={<AdminHome />} />
                </Route>
                <Route element={<StudentRoute />}>
                    <Route
                        path='/notes/create'
                        exact
                        element={<CreateNote />}
                    />
                    <Route
                        path='/notes/profile'
                        exact
                        element={<UpdateUser />}
                    />
                </Route>

                <Route exact path='/' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
