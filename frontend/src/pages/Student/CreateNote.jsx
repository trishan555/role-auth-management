import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import jwt_decode from 'jwt-decode'
import { Button, Form, Card } from 'react-bootstrap'
import UpdateNote from './UpdateNote'
import DeleteNote from './DeleteNote'
import NavStudent from '../../components/NavStudent'

export default function CreateNote() {
    //cookie decode
    const [cookie] = useCookies([])
    const token = cookie.jwt
    const decoded = jwt_decode(token)

    const [values, setValues] = useState({
        userid: decoded.id,
    })

    const [notes, setUsers] = useState([])
    const [show, setShow] = useState(false)

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
            //console.log(data)
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
                <NavStudent />

                <div className='p-5 d-flex justify-content-center'>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <h3 className='m-2'>Create Note</h3>
                        <Form.Group className='mb-4' controlId='formBasicEmail'>
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
                                placeholder='Title'
                            />
                            <Form.Text className='text-muted'> </Form.Text>

                            <Form.Label className='mt-3'>
                                Description
                            </Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                name='description'
                                type='text'
                                placeholder='Content '
                            />
                            <Form.Text className='text-muted'> </Form.Text>
                        </Form.Group>

                        <Button variant='primary' type='submit'>
                            Create
                        </Button>
                    </Form>
                </div>

                <div className='d-flex flex-wrap justify-content-center'>
                    {notes.map((note) => (
                        <div className='m-2' key={note._id}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{note.title}</Card.Title>
                                    <Card.Subtitle className='mb-2 text-muted'>
                                        {dateConvert(note.createdAt)}
                                    </Card.Subtitle>
                                    <Card.Text>{note.description}</Card.Text>
                                    <div className='d-grid gap-2'>
                                        <UpdateNote
                                            noteid={note._id}
                                            title={note.title}
                                            description={note.description}
                                            updatePage={updatePage}
                                        />
                                        <DeleteNote
                                            noteid={note._id}
                                            title={note.title}
                                            updatePage={updatePage}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
