import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import jwt_decode from 'jwt-decode'
import {
    Navbar,
    Button,
    Container,
    Nav,
    Form,
    Card,
    ButtonGroup,
} from 'react-bootstrap'
import UpdateNoteModel from './UpdateNoteModel'
import DeleteNoteModel from './DeleteNoteModel'

export default function CreateNote() {
    //cookie decode
    const [cookie] = useCookies([])
    const token = cookie.jwt
    const decoded = jwt_decode(token)

    const [values, setValues] = useState({
        userid: decoded.id,
    })

    const [notes, setUsers] = useState([])
    const [pages, setPages] = useState({})
    var [page, setPage] = useState(1)
    const [show, setShow] = useState(false)

    //logout
    const logOut = () => {
        window.location.replace('http://localhost:8000/user/logout')
        return false
    }

    //generate toast per error
    const generateError = (err) => toast.error(err)

    //handle note creation
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(
                'http://localhost:8000/note/createnote',
                { ...values },
                { withCredentials: true }
            )
            console.log(data)
            if (data) {
                if (data.errors) {
                    const { title, description } = data.errors
                    if (title) generateError(title)
                    else if (description) generateError(description)
                } else {
                    toast.success('Note created successfully')
                }
            }
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('403')) {
                window.location.replace('http://localhost:8000/user/logout')
                return false
            }
        }
        fetchNotes()
    }

    const fetchNotes = async () => {
        try {
            const result = await axios.get(
                `http://localhost:8000/note/allnotes/${decoded.id}`,
                { withCredentials: true }
            )
            setUsers(result.data.notes)
            setPages(result.data.pages)
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

    // const nextPage = () => {
    //     if (pages.totalPages > page) setPage(++page)
    // }
    // const previousPage = () => {
    //     if (1 < page) setPage(--page)
    // }
    const updatePage = (show) => {
        setShow(show)
    }

    useEffect(() => {
        fetchNotes()
    }, [show])

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
                        <Navbar.Brand>Note App | Notes</Navbar.Brand>
                        <Nav
                            defaultActiveKey='/notes/create'
                            className='me-auto'
                        >
                            <Nav.Link href='/notes/create'>
                                Create note
                            </Nav.Link>
                            <Nav.Link onClick={logOut}>
                                Log Out ({decoded.email})
                            </Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                <div className='p-5 d-flex justify-content-center'>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <h2 className='m-1'>Create Note</h2>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                name='title'
                                type='text'
                                placeholder='title'
                            />
                            <Form.Text className='text-muted'> </Form.Text>

                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                name='description'
                                type='text'
                                placeholder='Description '
                            />
                            <Form.Text className='text-muted'> </Form.Text>
                        </Form.Group>

                        <Button variant='primary' type='submit'>
                            Create
                        </Button>
                    </Form>
                </div>

                <div className='d-flex flex-wrap justify-content-center'>
                    {notes.map((detail) => (
                        <div className='m-2' key={detail._id}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{detail.title}</Card.Title>
                                    <Card.Subtitle className='mb-2 text-muted'>
                                        {dateConvert(detail.createdAt)}
                                    </Card.Subtitle>
                                    <Card.Text>{detail.description}</Card.Text>

                                    <UpdateNoteModel
                                        noteid={detail._id}
                                        title={detail.title}
                                        description={detail.description}
                                        updatePage={updatePage}
                                    />
                                    <DeleteNoteModel
                                        noteid={detail._id}
                                        title={detail.title}
                                        updatePage={updatePage}
                                    />
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
