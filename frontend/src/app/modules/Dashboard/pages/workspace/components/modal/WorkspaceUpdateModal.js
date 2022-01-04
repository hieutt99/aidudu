import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_ORIGIN, WORKSPACE_VISIBILITY } from '../../../../../../../config';
import ImageThumb from '../../../../../../../../src/_metronic/layout/components/header/header-menu/component/ImageThumb.js';
// "frontend/src/app/modules/Dashboard/pages/workspace/components/modal/WorkspaceUpdateModal.js"

const modalStyle = {
  backgroundImage: `url('https://a.trellocdn.com/prgb/dist/images/create-team/wavy-border.df0d81969c6394b61c0d.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `150%`,
}

function WorkspaceUpdateModal({ workspaceId, openWorkspace, handleWorkspaceModalClose }) {

    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, []);

    const handleWorkspaceSubmit = (values) => {
        console.log(values);//fixme

        let formData = new FormData();
        formData.append('logo', values.logo ? values.logo : '');
        formData.append('visibility', values.visibility);
        formData.append('name', values.name);

        console.log('formData');
        console.log(formData);

        setLoading(true);
        axios.put(`${BACKEND_ORIGIN}api/v1/workspaces/${workspaceId.workspaceId}/settings/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        })
        .then((response) => {
            console.log(response); //fixme
            setLoading(false);
            toast.success('Update workspace success!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true
            });
            handleWorkspaceModalClose();
        },        
         window.location.reload()
        )
        // console.log("/workspaces/"+String(workspaceId.workspaceId)+"/boards"),
        // history.push("/workspaces/"+String(workspaceId.workspaceId)+"/boards"))
        .catch((err) => {
            console.log(err);
        });
    };

    const schema = Yup.object().shape({
        name: Yup.string().required(),
        visibility: Yup.string().required(),
        logo: Yup.mixed()
    });

    return (
        <Modal size={'xl'} show={openWorkspace} onHide={handleWorkspaceModalClose} centered>
        <Modal.Body style={modalStyle}>
            <Container className={'mt-5 mx-5 mb-5'}>
            <Row>
                <Col lg={6} md={7}>
                <Row className={'mb-2'}>
                    <h2 className={'font-weight-bolder'}>Edit workspace's details</h2>
                </Row>
                <br />
                <Row className={''}>
                    <Formik
                    validationSchema={schema}
                    onSubmit={handleWorkspaceSubmit}
                    initialValues={{
                        name: '',
                        visibility: WORKSPACE_VISIBILITY[0],
                        logo: null
                    }}
                    >
                    {
                        ({ // formik obj
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isValid,
                        errors,
                        setFieldValue
                        }) => (
                        <Form noValidate onSubmit={handleSubmit} className='w-100'>
                            <Form.Group>
                            <Form.Label>Workspace name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter workspace name'
                                name='name'
                                value={values.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.name}
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Workspace visibility</Form.Label>
                            <Form.Control
                                as='select'
                                name='visibility'
                                onBlur={handleBlur}
                                value={values.workspace}
                                onChange={handleChange}
                            >
                                {
                                WORKSPACE_VISIBILITY.map((w, key) => (
                                    <option key={key} value={w}>
                                    {w}
                                    </option>
                                ))
                                }
                            </Form.Control>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Workspace logo</Form.Label>
                            <Form.Control
                                type={'file'}
                                name={'logo'}
                                // value={values.background}
                                onChange={(e) => {
                                setFieldValue('logo', e.currentTarget.files[0]);
                                }}
                            />
                            <ImageThumb file={values.logo}/>
                            </Form.Group>
                            <br />
                            <Button type='submit' className={'mr-5'}>
                            {loading ? <span className='ml-2 spinner spinner-white' /> : <span>Save</span>}
                            </Button>
                            <Button variant={'light'} onClick={handleWorkspaceModalClose}>Cancel</Button>
                        </Form>
                        )}
                    </Formik>
                </Row>
                </Col>
                <Col lg={6} md={5} className={'text-center mr-0 justify-content-center align-self-center'}>
                <Image
                    style={{marginLeft: "3rem"}}
                    fluid
                    src='https://a.trellocdn.com/prgb/dist/images/organization/empty-board.d1f066971350650d3346.svg'
                    rounded />
                </Col>
            </Row>
            </Container>
        </Modal.Body>
        </Modal>
    );
}

export default WorkspaceUpdateModal;