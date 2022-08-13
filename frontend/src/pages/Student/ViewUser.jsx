import { Modal, Button } from 'react-bootstrap'
import React, { useState } from 'react'
import { CgDetailsMore } from 'react-icons/cg'

function ViewUser({
    uid,
    firstName,
    lastName,
    email,
    phone,
    dob,
    status,
    accountType,
}) {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    function dateConvert(date) {
        return new Date(date).toLocaleDateString()
    }

    return (
        <>
            <CgDetailsMore onClick={handleShow} type='button' />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>ID: {uid}</p>
                    <p>Email: {email}</p>
                    <p>First Name: {firstName}</p>
                    <p>Last Name: {lastName}</p>
                    <p>Phone Number: {phone}</p>
                    <p>Date of Birth: {dateConvert(dob)}</p>
                    <p>Activated: {`${status}`}</p>
                    <p>Account type: {accountType}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewUser
