import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Image, Modal, Row, Form } from "react-bootstrap";
import { BiUpload } from "react-icons/bi";
import { BACKEND_ORIGIN } from "../../../../../../../config";
import { iconSize24, cardChooseFile } from "../BoardStyles";
import * as Yup from 'yup';
import { Formik } from 'formik';

export const UPDATE_BOARD_BACKGROUND = BACKEND_ORIGIN + 'api/v1/boards/';

export const backgroundImages = [
    'https://cdn.wallpapersafari.com/97/50/eRwDMy.jpg',
    'https://wallpaperaccess.com/full/2457129.jpg',
    'https://i.pinimg.com/originals/cd/4a/09/cd4a096b2096ebb4f460c171cf0f913e.jpg',
    'http://www.bestbackgroundwallpaper.com/wp-content/uploads/2020/09/low-poly-simple-mountain-landscape-ultra-hd-wallpaper-for-4k-uhd-widescreen-desktop-tablet-smartphone-5f6c9ccaee274.jpg',
    'https://www.teahub.io/photos/full/40-409335_1920x1080-pastel-wallpaper-tumblr-aesthetic-backgrounds.jpg',
    'https://wallpaperaccess.com/full/215112.jpg',
    'https://wallpaperaccess.com/full/1132047.jpg',
    'http://www.bestbackgroundwallpaper.com/wp-content/uploads/2020/09/abstract-geometric-background-ultra-hd-wallpaper-for-4k-uhd-widescreen-desktop-tablet-smartphone-5f6c9f4babf3d.jpg',
    'https://wallpaper.dog/large/10734569.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6763KP1sWCJ0C-bqDOHXezIrkQ8sEOTLLXg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCKjsgDRjk-i8mTalLHBwjd674I8SbO29QBA&usqp=CAU',
    'https://wallpaperaccess.com/full/4441362.jpg',
    'https://www.nintendo.com/content/dam/noa/en_US/wallpapers/animal-crossing/animal-crossing-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLYh5U3f2dYg6SY7uEXKixLKClQbHHqjfCeQ&usqp=CAU',
    'https://images.hdqwalls.com/download/4k-texture-simple-background-21-1920x1080.jpg'
];

const BoardChangeBackgroundDialog = ({ boardId, setBackground, onHide, show }) => {

    const [selectedImage, setSelectedImage] = useState(null);

    const onImageUpload = () => {
        const formData = new FormData();
        formData.append(
            'background',
            selectedImage,
        );

        console.log("Selected image: " + selectedImage);
        axios
            .patch(UPDATE_BOARD_BACKGROUND + boardId + '/', formData)
            .then(response => {
                console.log("Successfully update board background: " + response.data);
                setBackground(response.data["background"]);
            })
            .catch(error => console.log(error));
    }

    const schema = Yup.object().shape({
        title: Yup.string().required(),
        background: Yup.mixed(),
        workspace: Yup.string()
    });

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change background
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                    <div className='d-flex flex-column'>

                        {/* Upload from device */}
                        <div className='d-flex flex-column mb-5'>
                            <h5 className='mb-3'>Upload from device</h5>
                            <div className='d-flex'>
                                <Button variant='secondary' style={cardChooseFile}>
                                    <label htmlFor={"imageUpload"}>
                                        <input type="file" id="imageUpload" name="" hidden onChange={event => setSelectedImage(event.currentTarget.files[0])}/>
                                        <div className='d-flex flex-column align-items-center'>
                                            <BiUpload style={iconSize24} />
                                            Choose file
                                        </div>
                                    </label>
                                </Button>
                                {selectedImage &&
                                    <Image rounded style={cardChooseFile} src={selectedImage} />
                                }
                            </div>
                        </div>

                        {/* Choose images */}
                        <div className='d-flex flex-column'>
                            <h5 className='mb-3'>Images</h5>
                            <div className='d-flex flex-wrap' style={{ gap: "15px" }}>
                                {
                                    backgroundImages.map(image => {
                                        return <Image rounded style={cardChooseFile} src={image} type='button' />;
                                    })
                                }
                            </div>
                        </div>
                        
                        <Button onClick={onImageUpload}>Submit</Button>
                        {/* <Formik
    validationSchema={schema}
    onSubmit={onImageUpload}
    initialValues={{
        background: null,
    }}
>
    {
        ({ // formik obj
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
        }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Background</Form.Label>
                    <Form.Control
                        type={'file'}
                        name={'background'}
                        // value={values.background}
                        onChange={(e) => { setSelectedImage(e.currentTarget.files[0]) }}
                    />
                </Form.Group>



                <Button type='submit' variant="primary">Confirm</Button>

            </Form>
        )}
</Formik> */}

                    </div>
               


            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BoardChangeBackgroundDialog;