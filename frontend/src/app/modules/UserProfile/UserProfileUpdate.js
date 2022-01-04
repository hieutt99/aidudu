import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik,Formik, Field, Form, ErrorMessage, useField } from "formik";// create form 
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import {uploadAvatar} from "./_redux/UploadAvatar";


function checkIfFilesAreTooBig(files?: [File]): boolean {
  let valid = true
  if (files) {
    files.map(file => {
      const size = file.size / 1024 / 1024
      if (size > 10) {
        valid = false
      }
    })
  }
  return valid
}

export default function UserProfileUpdate(props) {
	// Fields
	const [loading, setloading] = useState(false);
	const [isError, setisError] = useState(false);
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user, shallowEqual);
	useEffect(() => {}, [user]);
	
	// Methods
	const saveUser = (values, setStatus, setSubmitting) => {
		setloading(true);
		setisError(false);
		// update user avatar 
		const updatedUser = Object.assign(user, {
			'avatar': values.avatar,
	});
    // user for update preparation
    dispatch(props.setUser(updatedUser));
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      setisError(true);
      // Do request to your server for user update, we just imitate user update there, For example:
      // update(updatedUser)
      //  .then(()) => {
      //    setloading(false);
      //  })
      //  .catch((error) => {
      //    setloading(false);
      //    setSubmitting(false);
      //    setStatus(error);
      // });
    }, 1000);
  };
  // UI Helpers
  const initialValues = {
    avatar: "",
	id:user.id,
  };
  // https://stackoverflow.com/questions/54020719/validating-file-size-and-format-with-yup
  const Schema = Yup.object().shape({
	avatar: Yup
		.mixed()
		.required("You need to provide a file")
		.test("fileSize", "The file is too large", (value) => {
			return value && value[0].size  <= 2000000;
		})
		.test("type", "Only the following formats are accepted: .jpeg, .jpg and .bmp", (value) => {
			return value && (
				value[0].type === "image/jpeg" ||
				value[0].type === "image/bmp" ||
				value[0].type === "image/png"
			);
		}),
	});
  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  // https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
	// values contain id avatar
	// responce data
    onSubmit: (values, { setStatus, setSubmitting }) => {
		saveUser(values, setStatus, setSubmitting);
		// id: user.id,
    },
    onReset: (values, { resetForm }) => {
		resetForm();
    },
  });
  
  // return (
	// <form className="card card-custom">
		// {loading && <ModalProgressBar />}
		// {/* begin::Header */}
		// <div className="card-header py-3">
			// <div className="card-title align-items-start flex-column">
				// <h3 className="card-label font-weight-bolder text-dark">
					// Change Avatar
				// </h3>
			// </div>
			// <div className="card-toolbar">
				// <button
					// type="submit"
					// className="btn btn-success mr-2"
					// disabled={
					  // formik.isSubmitting || (formik.touched && !formik.isValid)
					// }
				// >
					// Save Changes
					// {formik.isSubmitting}
				// </button>
			// </div>
		// </div>
		// {/* end::Header */}
		// {/* begin::Form */}
		// {(formik)=>{
			// return (
				// <>
					// <input
						// id="file"
						// name="profile"
						// type="file"
						// onChange={(event) => {
						  // const files = event.target.files;
						  // let myFiles =Array.from(files);
						  // formik.setFieldValue("profile", myFiles);
						// }}
						// multiple
					  // />
				// </>
			// )
		// }}
		
		// {/* end::Form */}
	// </form>
  // );
  return (
	<Formik
		initialValues={initialValues}
		validationSchema={Schema}
		onSubmit={(values, props) => {
		let data = new FormData();
		values.profile.forEach((photo, index) => {
			data.append("avatar", values.profile[index]);
		});
		data.append('email',user.email);
		data.append('username',user.username);
		uploadAvatar({'id':user.id,'avatar':data})
		}}
    >
		{(formik) => {
			return (
			  <>
				<form className="card card-custom">
					{loading && <ModalProgressBar />}
					<div className="card-header py-3">
						<div className="input-group mb-3">
							{/*<div className="input-group-prepend">
								<span className="input-group-text"></span>
							</div>
							<div className="custom-file">
							*/}
							<input 
								className="custom-file-input"
								id="file"
								name="profile"
								type="file"
								onChange={(event) => {
								  const files = event.target.files;
								  let myFiles =Array.from(files);
								  formik.setFieldValue("profile", myFiles);
								}}
							/>
							<label className="custom-file-label" >Upload Avatar</label>
							{/*
							</div>
							|| (formik.touched && !formik.isValid)*/}
						</div>
						<button type="submit" className="btn btn-success mr-2" disabled={
						  formik.isSubmitting 
						}>
							Save Changes
						</button>
					</div>
				</form>
			  </>
			);
		}}
    </Formik>
  );
}

// export {
	// UserProfileUpdate as UserProfileUpdate
// };