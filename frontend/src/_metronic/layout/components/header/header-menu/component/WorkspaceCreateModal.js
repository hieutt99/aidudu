import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import { Divider } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_ORIGIN, WORKSPACE_VISIBILITY } from '../../../../../../config';

export const POST_CREATE_WORKSPACE_URL = BACKEND_ORIGIN + 'api/v1/workspaces/';

function WorkspaceCreateModal({ openWorkspace, handleWorkspaceModalClose }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

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
    axios.post(POST_CREATE_WORKSPACE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response); //fixme
        setLoading(false);
        toast.success('Create workspace success!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true
        });
        handleWorkspaceModalClose();
      })
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
      <Modal.Body>
        <Container className={'mt-5 mx-5 mb-5'}>
          <Row>
            <Col lg={6} md={7}>
              <Row className={'mb-2'}>
                <h2 className={'font-weight-bolder'}>Let's build a workspace</h2>
                <div className={'text-dark-50 font-size-lg text-lowercase text-justify'}>
                  Boost your productivity by making it easier for everyone to access boards in one location.
                </div>
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
                        </Form.Group>
                        <br />
                        <Button type='submit' className={'mr-5'}>
                          {loading ? <span className='ml-2 spinner spinner-white' /> : <span>Create</span>}
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

export default WorkspaceCreateModal;