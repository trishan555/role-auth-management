import React, { useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import NavAdmin from '../components/NavAdmin'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    const [values, setValues] = useState({})

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
                    const { email, password, phone } = data.errors
                    if (email || password || phone)
                        generateError(email || password || phone)
                } else {
                    toast.success('Verification email send to the user !')
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
            <NavAdmin />

            <div className='py-4 d-flex justify-content-center'>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <h3 className='mb-4'>Create User</h3>
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

                    <Button className='mt-3' variant='primary' type='submit'>
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}
