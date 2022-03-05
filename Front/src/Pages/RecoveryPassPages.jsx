import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const RecoveryPassPages = () => {
    const { tokenId } = useParams()

    const [newPass, setNewPassword] = useState('');
    const [newPasswordRetype, setNewPasswordRetype] = useState('');

    const changePassword = async (e) => {
        e.preventDefault()
        if (newPass !== newPasswordRetype) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden!',
                showConfirmButton: false,
                timer: 3000
            })
        } else if (newPass === newPasswordRetype) {
            console.log('newPass', newPass)
            const res = await axios.put(`http://localhost:3001/api/v1/usuarios/recoverypassresponse/${tokenId}`, { contrasenia: newPass })
            console.log('res', res)
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Ha cambiado su contraseña con éxito',
                    showConfirmButton: false,
                    timer: 3000
                })
                setTimeout(() => { window.location.href = '/' }, 1000);
            }
        }
    }
    return (
        <div className="container my-5 pt-5">
            <h1 className="mt-5 text-center">Tienda Online</h1>
            <h3 className="mb-3 text-center">Cambio de contraseña</h3>
            <div className="row justify-content-center"  >
                <form className="col col-md-6 col-10 my-2" style={{ border: '1px solid gray' }} onSubmit={changePassword}>
                    <div className="form-group">
                        <p className="mt-2 text-center">Ingrese nueva contraseña</p>
                        <input
                            className="form-control"
                            type="password"
                            id="inputPassword6"
                            name="newPass"
                            required
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            placeholder="Contraseña nueva"
                            onChange={(e) => { setNewPassword(e.target.value) }}
                            autofocus
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="newPasswordRetype"
                            placeholder="Repetir contraseña"
                            required
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            type="password"
                            onChange={(e) => { setNewPasswordRetype(e.target.value) }}
                            autofocus
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button className="btn btn-danger my-2" >Cambiar contraseña</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default RecoveryPassPages;