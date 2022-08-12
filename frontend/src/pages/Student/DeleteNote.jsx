import { toast } from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
function DeleteNote({ noteid, title, updatePage }) {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        updatePage(show)
    }, [show])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(
                `http://localhost:8000/note/deletenote/${noteid}`,
                { withCredentials: true }
            )
            console.log(data)
            toast.success('Note Deleted successfully')
            handleClose()
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('403')) {
                window.location.replace('http://localhost:8000/user/logout')
                return false
            }
        }
    }

    return (
        <>
            <Button variant='danger' size='sm' onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <h3>Are you sure want to delete this note?</h3>

                        <Button variant='primary' type='submit'>
                            Delete
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' size='sm' onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default DeleteNote
