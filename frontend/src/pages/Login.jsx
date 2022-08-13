import React, { useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Navbar, Button, Container, Nav, Form } from 'react-bootstrap'
import { FaForumbee } from 'react-icons/fa'

export default function Login() {
    const navigate = useNavigate()

    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const generateError = (err) => toast.error(err)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(
                'http://localhost:8000/user/login',
                { ...values },
                { withCredentials: true }
            )
            console.log(data)
            if (data) {
                if (data.errors) {
                    const { email, password } = data.errors
                    if (email) generateError(email)
                    else if (password) generateError(password)
                } else {
                    navigate('/admin')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div>
                <Toaster position='top-center' reverseOrder={false} />
            </div>

            <Navbar bg='white' variant='white'>
                <Container>
                    <Navbar.Brand>
                        <FaForumbee />
                        <h2>WasToWill</h2>
                    </Navbar.Brand>
                    <Nav defaultActiveKey='/' className='justify-content-end'>
                        <Nav.Link href='/'>Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div>
                <div className='p-5 d-flex justify-content-center'>
                    <Form
                        onSubmit={(e) => handleSubmit(e)}
                        style={{ width: '18rem' }}
                    >
                        <h3>Login</h3>
                        <Form.Group controlId='formBasicEmail'>
                            <br></br>
                            <Form.Label>Email Address</Form.Label>
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

                            <Form.Label className='mt-3'>Password</Form.Label>
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

                        <br></br>
                        <Button variant='primary' type='submit'>
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}
