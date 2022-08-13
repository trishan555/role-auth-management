import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { Table, Form, Row, Col } from 'react-bootstrap'
import ViewUser from '../Student/ViewUser'
import { CgTrash } from 'react-icons/cg'

import NavAdmin from '../../components/NavAdmin'

export default function AdminHome() {
    const [users, setUsers] = useState([])

    //fetch all users
    const fetchUsers = async () => {
        try {
            const result = await axios.get(
                `http://localhost:8000/user/allusers/`,
                {
                    withCredentials: true,
                }
            )
            setUsers(result.data.users)
        } catch (error) {
            if (
                error.message.includes('401') ||
                error.message.includes('403')
            ) {
                window.location.replace('http://localhost:8000/user/logout')
                return false
            }
        }
    }

    const deleteUser = (id) => {
        axios
            .delete(`http://localhost:8000/user/delete/${id}`)
            .then(() => {
                toast.success('Student successfully deleted !')
                fetchUsers()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //handling search
    const handleSearch = async (e) => {
        try {
            if (e.target.value === '') {
                fetchUsers()
            }
            const result = await axios.get(
                `http://localhost:8000/user/usersearch/${e.target.value}`,
                { withCredentials: true }
            )
            setUsers(result.data.users)
        } catch (error) {
            if (
                error.message.includes('401') ||
                error.message.includes('403')
            ) {
                window.location.replace('http://localhost:8000/user/logout')
                return false
            }
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    function dateConvert(date) {
        return new Date(date).toLocaleDateString()
    }

    return (
        <>
            <div>
                <Toaster position='top-center' reverseOrder={false} />
            </div>
            <div>
                <NavAdmin />

                <div className='d-flex  justify-content-center'>
                    <h3 className='m-5'>Admin Dashboard</h3>
                </div>
                <div className='d-flex justify-content-end mb-4'>
                    <Form>
                        <Row className=''>
                            <Col s={10}>
                                <Form.Control
                                    onChange={(e) => handleSearch(e)}
                                    name='item'
                                    placeholder='Search by email'
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className='d-flex flex-wrap justify-content-center'>
                    <Table striped bordered hover style={{ width: '75vw' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>First name</th>
                                <th className='text-center'>Last name</th>
                                <th className='text-center'>Email</th>
                                <th className='text-center'>Phone Number</th>
                                <th className='text-center'>Birthday</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className='text-center'>
                                        {user.firstName}
                                    </td>
                                    <td className='text-center'>
                                        {user.lastName}
                                    </td>
                                    <td className='text-center'>
                                        {user.email}
                                    </td>
                                    <td className='text-center'>
                                        {user.phone}
                                    </td>
                                    <td className='text-center'>
                                        {dateConvert(user.dateOfBirth)}
                                    </td>
                                    <td className='text-center'>
                                        <div className='container'>
                                            <ViewUser
                                                style={{
                                                    fontSize: '1rem',
                                                }}
                                                uid={user._id}
                                                email={user.email}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                phone={user.phone}
                                                dob={user.dateOfBirth}
                                                status={user.status}
                                                accountType={user.accountType}
                                            />

                                            <CgTrash
                                                style={{
                                                    marginLeft: '3rem',
                                                    fontSize: '1.2rem',
                                                }}
                                                type='button'
                                                onClick={() =>
                                                    deleteUser(user._id)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
