import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";// create form 
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";

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
    const updatedUser = Object.assign(user, {
		avatar: values.avatar,
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
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      resetForm();
    },
  });
  return (
	<form className="card card-custom" onSubmit={formik.handleSubmit}>
		{loading && <ModalProgressBar />}
		{/* begin::Header */}
		<div className="card-header py-3">
			<div className="card-title align-items-start flex-column">
				<h3 className="card-label font-weight-bolder text-dark">
					Change Avatar
				</h3>
				<span className="text-muted font-weight-bold font-size-sm mt-1">
					Change your account password
				</span>
			</div>
			<div className="card-toolbar">
				<button
					type="submit"
					className="btn btn-success mr-2"
					disabled={
					  formik.isSubmitting || (formik.touched && !formik.isValid)
					}
				>
					Save Changes
					{formik.isSubmitting}
				</button>
				{/*
				<Link
					to="/user-profile/profile-overview"
					className="btn btn-secondary"
				>
					Cancel
				</Link>
				*/}
			</div>
		</div>
		{/* end::Header */}
		{/* begin::Form */}
		<div className="form">
			
		</div>
		{/* end::Form */}
	</form>
  );
}

// export {
	// UserProfileUpdate as UserProfileUpdate
// };