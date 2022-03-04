import React from 'react';
import { ToastContainer as BsToastContainer, Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { hide_toast } from '../actions';

function ToastContainer() {
    const toasts = useSelector(state => state.toasts);
    const dispatch = useDispatch();

    return (
        <BsToastContainer position="top-end" className="p-3">
            {toasts.map(toast => (
                <Toast key={toast.id} bg={toast.bg} onClose={() => dispatch(hide_toast(toast.id))} show={toast.show} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">{toast.page}</strong>
                    </Toast.Header>
                    <Toast.Body className={((toast.bg.toLowerCase() === 'dark') || (toast.bg.toLowerCase() === 'success') || (toast.bg.toLowerCase() === 'danger')) && 'text-white'}>
                        {toast.content}
                    </Toast.Body>
                </Toast>
            ))}
        </BsToastContainer>
    )
}

export default ToastContainer;