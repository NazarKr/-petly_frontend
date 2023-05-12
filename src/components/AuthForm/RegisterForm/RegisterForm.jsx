// import React from 'react';
import { Formik, ErrorMessage } from 'formik';
// import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { register } from '../../../redux/auth/authOperations';
// import ModalCongrats from 'components/Modal/ModalCongrats/ModalCongrats';
// import { toast } from 'react-toastify';

function RegisterForm() {
  const dispatch = useDispatch();
  //  const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const regValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Mail is required'),
    password: Yup.string()
      .required()
      .min(6)
      .max(16)
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,16}$/,
        'Password must contain at least 1 UPPERCASE letter, 1 lowercase letter, and 1 number.'
      ),
    confirmPassword: Yup.string()
      .required('Fill the gap')
      .oneOf([Yup.ref('password'), null], 'Passwords must match!'),
  });

  return (
    <>
      <div>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={regValidationSchema}
          onSubmit={(values, { resetForm }) => {
            const newUser = {
              email: values.email,
              password: values.password,
            };
            dispatch(register(newUser));
            resetForm();
            console.log(newUser);
          }}
        >
          {({
            values,
            // errors,
            // touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {/* {errors.email && touched.email && errors.email} */}
                <ErrorMessage component="div" name="email" />
              </label>

              <label htmlFor="password">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {/* {errors.password && touched.password && errors.password} */}
                <ErrorMessage component="div" name="password" />
              </label>

              <label htmlFor="passwordRepeat">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />
                {/* {errors.password && touched.password && errors.password} */}
                <ErrorMessage component="div" name="confirmPassword" />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
              // onClick={openModal}
              >
                Registration
              </button>
              {/* {isModalOpen && <ModalCongrats onClose={closeModal} />} */}
              <div>
                <p>Already have an account?</p>
                {/* <Link to="/login">Login</Link> */}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default RegisterForm;
