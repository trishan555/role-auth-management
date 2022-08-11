import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { Navbar, Button, Container, Nav, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

export default function Register() {
    const navigate = useNavigate()
    const [values, setValues] = useState({})
    const [cookie] = useCookies([])

    const token = cookie.jwt
    const decoded = jwt_decode(token)

    const logOut = () => {
        window.location.replace('http://localhost:8000/user/logout')
        return false
    }

    const generateError = (err) => toast.error(err)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(
                'http://localhost:8000/user/createuser',
                { ...values },
                { withCredentials: true }
            )
            console.log(data)
            if (data) {
                if (data.errors) {
                    const { email } = data.errors
                    if (email) generateError(email)
                } else {
                    toast.success('User created successfully')
                    setTimeout(() => {
                        navigate('/admin')
                    }, 2000)
                }
            }
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('403')) {
                window.location.replace('http://localhost:8000/user/logout')
                return false
            }
        }
    }

    return (
        <>
            <div>
                <Toaster position='top-center' reverseOrder={false} />
            </div>
            <Navbar bg='dark' variant='dark'>
                <Container>
                    <Navbar.Brand>Note App | Admin Panel</Navbar.Brand>
                    <Nav defaultActiveKey='/admin/create' className='me-auto'>
                        <Nav.Link href='/admin'>Home</Nav.Link>
                        <Nav.Link href='/admin/create'>Create User</Nav.Link>
                        <Nav.Link onClick={logOut}>
                            Log Out ({decoded.email})
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className='p-5 d-flex justify-content-center'>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <h2 className='m-1'>Create User</h2>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            name='firstName'
                            type='text'
                            placeholder='Enter first name'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            name='lastName'
                            type='text'
                            placeholder='Enter last name'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            name='email'
                            type='email'
                            placeholder='Enter email'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            name='password'
                            type='password'
                            placeholder='Enter password'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            name='phone'
                            type='text'
                            placeholder='Enter phone number'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                    </Form.Group>
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control
                        onChange={(e) =>
                            setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                            })
                        }
                        name='dateOfBirth'
                        type='date'
                        placeholder='dateOfBirth'
                    />
                    <Form.Text className='text-muted'> </Form.Text>

                    <Button variant='primary' type='submit'>
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}
