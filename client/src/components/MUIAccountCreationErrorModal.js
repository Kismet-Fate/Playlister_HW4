import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import AuthContext from '../auth';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function MUIAccountCreationErrorModal() {
    const { auth } = useContext(AuthContext);
    function handleClose(event) {
        auth.showErr("");
    }

    return (
        <React.Fragment>
            <Modal
                open={auth.err !== ''}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 500 }}>
                    <h2 id="child-modal-title">Error</h2>
                    <Alert severity='error'>{auth.err}</Alert>
                </Box>
                
                
            </Modal>
        </React.Fragment>
    );
}
