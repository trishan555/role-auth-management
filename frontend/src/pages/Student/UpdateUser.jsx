import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Navbar, Button, Container, Nav, Form } from 'react-bootstrap'
import { Toaster } from 'react-hot-toast'
import jwt_decode from 'jwt-decode'

export default function UpdateUser() {
    const [student, setStudent] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const [cookie] = useCookies([])
    const token = cookie.jwt
    const decoded = jwt_decode(token)

    useEffect(() => {
        getUser()
    }, [isLoading])
    const getUser = async () => {
        await axios
            .get(`http://localhost:8000/user/get/${decoded.id}`)
            .then((res) => {
                setStudent(res.data.user)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
        console.log(student)
    }

    const [firstName, setFirstName] = useState(student.firstName)
    const [lastName, setLastName] = useState(student.lastName)
    const [password, setPassword] = useState(student.password)
    const [phone, setPhone] = useState(student.phone)
    const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth)

    const logOut = () => {
        window.location.replace('http://localhost:8000/user/logout')
        return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(
                `http://localhost:8000/user/updateuser/${decoded.id}`,

                { withCredentials: true }
            )
            console.log(data)
            window.location.replace('http://localhost:8000/logout')
            return false
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('403')) {
                window.location.replace('http://localhost:8000/logout')
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
                    <Navbar.Brand>WasToWill</Navbar.Brand>
                    <Nav defaultActiveKey='notes/profile' className='me-auto'>
                        <Nav.Link href='/notes/create'>Create note</Nav.Link>
                        <Nav.Link onClick={logOut}>
                            Log Out ({decoded.email})
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className='p-5 d-flex justify-content-center'>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <h2 className='m-1'>Profile</h2>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <br></br>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            value={firstName}
                            name='firstName'
                            type='text'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                        <br></br>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            value={lastName}
                            name='lastName'
                            type='text'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                        <br></br>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            value={password}
                            name='password'
                            type='password'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                        <br></br>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control value={phone} name='phone' type='phone' />
                        <Form.Text className='text-muted'> </Form.Text>
                        <br></br>
                        <Form.Label>Birth Date</Form.Label>
                        <Form.Control
                            value={dateOfBirth}
                            name='dateOfBirth'
                            type='date'
                        />
                        <Form.Text className='text-muted'> </Form.Text>
                        <br></br>
                    </Form.Group>
                    <Button variant='primary' type='submit'>
                        Update
                    </Button>
                </Form>
            </div>
        </>
    )
}
