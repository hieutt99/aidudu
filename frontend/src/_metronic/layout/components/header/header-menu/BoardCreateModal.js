import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import axios from 'axios';
import { BACKEND_ORIGIN } from '../../../../../config';
import { toast } from 'react-toastify';

export const POST_CREATE_BOARD_URL = BACKEND_ORIGIN + 'api/v1/boards/';

// TODO: add success toast
function BoardCreateModal({ openBoard, setOpenBoard, workspaces }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('workspaces: ');//fixme
    console.log(workspaces);
  }, [workspaces]);

  const handleBoardSubmit = (values) => {
    console.log(values);//fixme

    let formData = new FormData();
    formData.append('background', values.background ? values.background : '');
    formData.append('name', values.title);
    formData.append('workspace', values.workspace);

    console.log('formData');
    console.log(formData);

    setLoading(true);
    axios.post(POST_CREATE_BOARD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response); //fixme
        setLoading(false);
        toast.success('Create board success!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        handleBoardClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBoardClose = () => {
    setOpenBoard(false);
  };

  const schema = Yup.object().shape({
    title: Yup.string().required(),
    background: Yup.mixed(),
    workspace: Yup.string()
  });

  return (
    <>
      <Modal show={openBoard} onHide={handleBoardClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={handleBoardSubmit}
            initialValues={{
              title: '',
              background: null,
              workspace: workspaces.length > 0 ? workspaces[0].id : ''
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
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Board title'
                      name='title'
                      value={values.title}
                      onChange={handleChange}
                      isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Background</Form.Label>
                    <Form.Control
                      type={'file'}
                      name={'background'}
                      // value={values.background}
                      onChange={(e) => {
                        setFieldValue('background', e.currentTarget.files[0]);
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Choose workspace</Form.Label>
                    <Form.Control
                      as='select'
                      name='workspace'
                      onBlur={handleBlur}
                      value={values.workspace}
                      onChange={handleChange}
                    >
                      {
                        workspaces.map((w, key) => (
                          <option key={key} value={w.id}>{w.name}</option>
                        ))
                      }
                    </Form.Control>
                  </Form.Group>
                  <Button type='submit' className={'mr-5'}>
                    <span>Submit</span>
                    {loading && <span className='ml-2 spinner spinner-white' />}
                  </Button>
                  <Button variant={'light'} onClick={handleBoardClose}>Cancel</Button>
                </Form>
              )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BoardCreateModal;