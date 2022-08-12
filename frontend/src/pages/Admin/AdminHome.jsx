import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import {
    Navbar,
    Table,
    Button,
    Container,
    Nav,
    Form,
    Row,
    Col,
} from 'react-bootstrap'
import ViewUser from '../Student/ViewUser'
import jwt_decode from 'jwt-decode'
import { CgTrash } from 'react-icons/cg'

export default function AdminHome() {
    //cookie decode
    const [cookie] = useCookies([])
    const token = cookie.jwt
    const decoded = jwt_decode(token)

    //logout
    const logOut = () => {
        window.location.replace('http://localhost:8000/user/logout')
        return false
    }

    const [users, setUsers] = useState([])

    //fetch all users(students)
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
                <Navbar bg='dark' variant='dark'>
                    <Container>
                        <Navbar.Brand>WasToWill</Navbar.Brand>
                        <Nav defaultActiveKey='/admin' className='me-auto'>
                            <Nav.Link href='/admin'>Home</Nav.Link>
                            <Nav.Link href='/admin/create'>
                                Create User
                            </Nav.Link>
                            <Nav.Link onClick={logOut}>
                                Log Out ({decoded.email})
                            </Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                <div className='d-flex  justify-content-center'>
                    <h2 className='m-3'>All Users</h2>
                </div>

                <div className='d-flex flex-wrap justify-content-center'>
                    <Table striped bordered hover style={{ width: '75vw' }}>
                        <thead>
                            <tr>
                                <th className='text-center'>First Name</th>
                                <th className='text-center'>Last Name</th>
                                <th className='text-center'>Email</th>
                                <th className='text-center'>Phone Number</th>
                                <th className='text-center'>Birth Day</th>
                                <th className='text-center'>
                                    <Form>
                                        <Row>
                                            <Col xs={10}>
                                                <Form.Control
                                                    onChange={(e) =>
                                                        handleSearch(e)
                                                    }
                                                    name='item'
                                                    placeholder='Search by email'
                                                />
                                            </Col>
                                        </Row>
                                    </Form>
                                </th>
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
                                        <div className='container mt-3 mr-2'>
                                            <ViewUser
                                                uid={user._id}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                email={user.email}
                                                phone={user.phone}
                                                dob={user.dateOfBirth}
                                                status={user.status}
                                                accountType={user.accountType}
                                            />

                                            <Button
                                                variant='primary'
                                                onClick={() =>
                                                    deleteUser(user._id)
                                                }
                                            >
                                                <CgTrash />
                                            </Button>
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
