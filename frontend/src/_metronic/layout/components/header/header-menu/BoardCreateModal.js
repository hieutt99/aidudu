import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';

function BoardCreateModal({ openBoard, setOpenBoard, workspaces }) {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    console.log("workspaces: " + workspaces);
    console.log("create board data: " + data);
  }, [workspaces, data]);

  const handleBoardSubmit = (values) => {
    setData({
      ...data,
      ...values
    });
  };

  const handleBoardClose = () => {
    setOpenBoard(false);
  };

  const schema = Yup.object().shape({
    title: Yup.string().required(),
    background: Yup.string(),
    workspace: Yup.string()
  });

  return (
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
            background: '',
            workspace: workspaces.length > 0 ? workspaces[0].name : ''
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
               errors
             }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Board title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Background</Form.Label>
                  <Form.Control
                    type={'file'}
                    name={'background'}
                    value={values.background}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Choose workspace</Form.Label>
                  <Form.Control
                    as="select"
                    name="workspace"
                    onBlur={handleBlur}
                    value={values.workspace}
                    onChange={handleChange}
                  >
                    {
                      workspaces.map((w, key) => (
                        <option key={key} value={w.name}>{w.name}</option>
                      ))
                    }
                  </Form.Control>
                </Form.Group>
                <Button type='submit'>Submit</Button>
              </Form>
            )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default BoardCreateModal;