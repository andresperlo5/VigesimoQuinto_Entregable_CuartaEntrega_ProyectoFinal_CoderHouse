import React, { useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../css/NavbarHome.css'

function NavbarHome() {

    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [edad, setEdad] = useState('')
    const [telefono, setTelefono] = useState('')
    const [usuario, setUsuario] = useState('')
    const [contrasenia, setContrasenia] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const wrapperRef = useRef(null)
    const [previewImage, setPreviewImage] = useState('')
    const [image, setImage] = useState(null)


    const validateupload = e =>
        e.target.files[0].type == 'image/png' ||
        e.target.files[0].type == 'image/jpg' ||
        e.target.files[0].type == 'image/jpeg'

    const upload = e => {
        if (e.target.files[0].size <= 20000000) {
            let file = e.target.files[0];
            let reader = new FileReader()
            reader.onload = function (e) {
                setPreviewImage(e.target.result)
            }
            reader.readAsDataURL(file)
        } else {
            e.target.value = ''
            alert('subir algo min 2 mb')
        }
    }

    const handleSubmitReg = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (image === null) {
            setTimeout(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...Error',
                    text: 'Campo imagen obligatorio',
                })
            }, 1000);
            setIsLoading(false)
            return
        }

        const res = await axios.post('http://localhost:3001/api/v1/usuarios/register', { nombre, direccion, edad, telefono, usuario, contrasenia })
        let reSetData = res.data.userData.admin

        localStorage.setItem('idUser', res.data.id ? res.data.id : res.data._id)
        localStorage.setItem('idCart', res.data.userData.carritoID)
        localStorage.setItem('admin', res.data.userData.admin)
        localStorage.setItem('token', res.data.userData.token)
        localStorage.setItem('nombre', res.data.userData.nombre)

        const formData = new FormData()
        formData.append('image', image)

        const resp = await axios.post(`http://localhost:3001/api/v1/usuarios/${res.data._id ? res.data._id : res.data.id}/upload`, formData)
        localStorage.setItem('foto', resp.data)
        if (resp) setIsLoading(false)

        if (reSetData == true) {
            window.location.href = '/admin'
        } else {
            window.location.href = '/loginUser'
        }
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        console.log('antes del axios')
        const res = await axios.post('http://localhost:3001/api/v1/usuarios/login', { usuario, contrasenia })
        if (res.data.err) {
            setIsLoading(false)
            Swal.fire({
                icon: 'error',
                title: 'Oops...Error',
                text: res.data.err.msg,
            })
        } else {
            Swal.fire(
                'Loguado correctamente!',
                'Ingresando...',
                'success'
            )
            localStorage.setItem('idUser', res.data.userLogin.id ? res.data.userLogin.id : res.data.userLogin._id)
            localStorage.setItem('idCart', res.data.userLogin.carritoID)
            localStorage.setItem('admin', res.data.userLogin.admin)
            localStorage.setItem('token', res.data.userLogin.token)
            localStorage.setItem('nombre', res.data.userLogin.nombre)
            localStorage.setItem('foto', res.data.userLogin.foto)
            let reSetData = res.data.userLogin.admin

            if (reSetData) setIsLoading(false)

            if (reSetData == true) {
                window.location.href = '/admin'
            } else {
                window.location.href = '/loginUser'
            }
        }
    }

    const handleRecoveryPass = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const res = await axios.post('http://localhost:3001/api/v1/usuarios/sendrecoverypass', { usuario })
        if (res.request.status === 200) {
            setIsLoading(false)
            Swal.fire(
                'Revisa Tu Correo!',
                'Ya falta menos para que recuperes tu contraseña!',
                'success'
            )
            setTimeout(() => { window.location.href = '/' }, 1000);
        }


    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <div>
                    <a className="navbar-brand" href="/">E-Commerce</a>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active text-center" href="/">Inicio</a>

                        {/* Boton Modal Inicio de Sesion */}
                        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                            Iniciar Sesion
                        </button>

                        <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel1">Inicio de Sesion</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Formulario de Inicio de Sesion */}
                                        <form onSubmit={handleSubmitLogin}>
                                            <div class="mb-3">
                                                <label for="exampleInputEmail1a" class="form-label">Usuario</label>
                                                <input type="text" class="form-control" id="exampleInputEmail1a" aria-describedby="emailHelp" onChange={(e) => { setUsuario(e.target.value) }} required />
                                            </div>
                                            <div class="mb-3">
                                                <label for="exampleInputPassword1a" class="form-label">Contraseña</label>
                                                <input type="password" class="form-control" id="exampleInputPassword1a" onChange={(e) => { setContrasenia(e.target.value) }} required />
                                            </div>
                                            <div className='text-center py-3'>
                                                <span className='d-block'><a href="" data-bs-toggle="modal" data-bs-target="#exampleModal2">No tenes cuenta aun?</a></span>
                                                <span className='small'><a href="" data-bs-toggle="modal" data-bs-target="#exampleModal3">Olviste tu contraseña?</a></span>
                                            </div>

                                            {
                                                isLoading === false
                                                    ?
                                                    <button type="submit" class="btn btn-outline-primary">Iniciar Sesion</button>
                                                    :
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                            }

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Boton Modal Registrarse */}
                        <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                            Registrarse
                        </button>

                        <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel2">Registrarse</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    {/* Formulario de Registrarse */}
                                    <div class="modal-body">

                                        <form onSubmit={handleSubmitReg}>
                                            <div>
                                                <div className='col col-6'>
                                                    <form>
                                                        <label for="exampleInputEmail1b" class="form-label">Foto / Avatar</label>

                                                        <div className="form-group d-none">
                                                            <input
                                                                required
                                                                type="file"
                                                                className="form-control-file"
                                                                name='file'
                                                                onChange={e => {
                                                                    setImage(e.target.files[0])
                                                                    let file = e.target.files
                                                                    if (file.length === 1 && validateupload(e)) {
                                                                        upload(e)
                                                                    } else {
                                                                        e.target.value = ''
                                                                        alert('cargar imagen')
                                                                    }
                                                                }}
                                                                ref={wrapperRef}
                                                                accept="image/gif, image/jpg, image/png"
                                                            />
                                                        </div>
                                                        <div className='previewImagen px-auto' style={{ cursor: 'pointer' }} onClick={() => {
                                                            wrapperRef.current.click()
                                                        }}>
                                                            <img src={previewImage} className='imagenPrev' alt="" />
                                                        </div>
                                                        <input type="text" className=' border-0 borderInputImg' readOnly />
                                                    </form>
                                                </div>

                                            </div>
                                            <div className='d-flex justify-content-around'>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1b" class="form-label">Nombre</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1b" aria-describedby="emailHelp" onChange={(e) => { setNombre(e.target.value) }} required />
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1b" class="form-label">Direccion</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1b" aria-describedby="emailHelp" onChange={(e) => { setDireccion(e.target.value) }} required />
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-around'>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1b" class="form-label">Edad</label>
                                                    <input type="number" class="form-control" id="exampleInputEmail1b" aria-describedby="emailHelp" onChange={(e) => { setEdad(e.target.value) }} required />
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1b" class="form-label">Telefono</label>
                                                    <input type="number" class="form-control" id="exampleInputEmail1b" aria-describedby="emailHelp" onChange={(e) => { setTelefono(e.target.value) }} required />
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-around'>
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1b" class="form-label">Email</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1b" aria-describedby="emailHelp" onChange={(e) => { setUsuario(e.target.value) }} required />
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleInputPassword1b" class="form-label">Contraseña</label>
                                                    <input type="password" class="form-control" id="exampleInputPassword1b" onChange={(e) => { setContrasenia(e.target.value) }} required />
                                                </div>

                                            </div>
                                            <div className='text-center py-3'>
                                                <span className='d-block'>Tenes tu cuenta ya creada? <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal1"> Haz Click Aqui</a></span>
                                            </div>

                                            {
                                                isLoading === false
                                                    ?
                                                    < button type="submit" class="btn btn-outline-primary">Enviar Datos</button>
                                                    :
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Recuperar Contraseña */}
                        <div className="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel1">Recuperar Contraseña</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Formulario de Inicio de Sesion */}
                                        <form onSubmit={handleRecoveryPass}>
                                            <div class="mb-3">
                                                <label for="exampleInputEmail1a" class="form-label">Coloque su email</label>
                                                <input type="text" class="form-control" id="exampleInputEmail1a" aria-describedby="emailHelp" onChange={(e) => { setUsuario(e.target.value) }} required />
                                            </div>
                                            {
                                                isLoading === false
                                                    ?
                                                    <button type="submit" class="btn btn-outline-primary">Enviar</button>
                                                    :
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div >
            </div >
        </nav >
    )
}

export default NavbarHome;