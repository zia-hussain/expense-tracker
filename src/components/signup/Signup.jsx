import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import SignupImg from "../../assets/images/signup shop img.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; // Adjust path accordingly
import * as Yup from "yup";

const ShopCreate = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .trim("Email cannot include leading or trailing spaces")
      .strict(true)
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be no more than 15 digits")
      .required("Phone number is required"),
    address: Yup.string()
      .trim("Address cannot include leading or trailing spaces")
      .strict(true)
      .required("Address is required"),
    zipCode: Yup.string()
      .matches(/^[0-9]+$/, "Zip Code must be digits only")
      .required("Zip Code is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .trim("Password cannot include leading or trailing spaces")
      .strict(true)
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    avatar: Yup.mixed().required("Shop image is required"),
  });

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    console.log("Signup function called with values:", values);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      console.log("User created:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "This email address is already in use." });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ email: "The email address is not valid." });
      } else if (error.code === "auth/weak-password") {
        setErrors({ password: "Password should be at least 6 characters." });
      } else {
        setErrors({ email: error.message }); // General error
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 select-none">
      <div className="max-w-7xl w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-auto">
        {/* Left side - Image */}
        <div
          className="hidden lg:block bg-cover bg-center relative"
          style={{
            backgroundImage: `url("${SignupImg}")`,
            height: "100%",
            width: "100%",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(17, 22, 29, 1) 3%, rgba(0, 0, 0, 0) 100%)",
            }}
          ></div>
        </div>

        {/* Right side - Form */}
        <div className="bg-gray-800 p-8 sm:p-12 flex items-center justify-center h-full relative">
          <div className="w-full max-w-md relative z-30">
            <h2 className="text-3xl font-extrabold text-white">
              Register as a vendor
              <span className="text-blue-500 pl-1">.</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Sign In
              </Link>
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={null}
              onSubmit={handleSignup}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6 mt-8">
                  {/* Email Field */}
                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Field
                      type={visible ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        size={25}
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-3 cursor-pointer text-gray-400"
                        size={25}
                        onClick={() => setVisible(true)}
                      />
                    )}
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Field
                      type={visibleConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, rgba(17, 22, 29, 1) 0%, rgba(28, 37, 50, 1) 50%, rgba(0, 0, 0, 0) 100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
