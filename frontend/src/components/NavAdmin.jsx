import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import { useCookies } from 'react-cookie'
import { FaForumbee } from 'react-icons/fa'

const NavAdmin = () => {
    const [cookie] = useCookies([])
    const token = cookie.jwt
    const decoded = jwt_decode(token)

    const logOut = () => {
        window.location.replace('http://localhost:8000/user/logout')
        return false
    }
    return (
        <div>
            <Navbar bg='white' variant='white'>
                <Container>
                    <Navbar.Brand>
                        <FaForumbee />
                        <h2>WasToWill</h2>
                    </Navbar.Brand>
                    <Nav className='justify-content-end'>
                        <Nav.Link href='/admin'>Home</Nav.Link>

                        <Nav.Link href='/admin/create'>Create User</Nav.Link>

                        <Nav.Link onClick={logOut}>
                            Logout ({decoded.email})
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavAdmin
