import { useState, useContext } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from '../../Context/UserContext'

export default function Register() {
  let navigate = useNavigate()
  const { saveUserToken } = useContext(UserContext)
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)

  let user = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
  }

  let validate = Yup.object().shape({
    name: Yup.string()
      .required('Name is Required')
      .min(3, 'Too Short! Minimum 3')
      .max(5, 'Too Long! Maximum 5'),

    email: Yup.string()
      .required('Email is Required')
      .email('Invalid Email'),

    password: Yup.string()
      .required('Password is Required')
      .min(6, 'Minimum 6')
      .max(20, 'Maximum 20')
      .matches(/^[A-Z][a-z0-9]{3,8}$/, 'Invalid Password'),

    rePassword: Yup.string()
      .required('rePassword is Required')
      .oneOf([Yup.ref('password')], 'Not Match Password'),

    phone: Yup.string()
      .required('Phone is Required')
      .matches(/^01[0125][0-9]{8}$/, 'Invalid Phone')
  })

async function submitForm(val) {
  try {
    setloading(true)
    // API CALL to Register
    const { data } = await axios.post(
      'https://ecommerce.routemisr.com/api/v1/auth/signup',
      val
    )
    // SUCCESSFUL REGISTER, NOW LOGIN
    localStorage.setItem('userToken' , data.token)
    saveUserToken(data.token)
    navigate('/login')
  } catch (err) {
  console.log("API ERROR:", err.response?.data)
    // ERROR HANDLING
  seterror(
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    JSON.stringify(err?.response?.data)
  )
  setloading(false)
  } finally {
    setloading(false)
  }
}

  let formik = useFormik({
    initialValues: user,
    onSubmit: submitForm,
    validationSchema: validate
  })

  return (
    <>
      <div className="mx-auto py-20">
        <h2 className="font-bold text-4xl text-green-600">
          Register Now
        </h2>

        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto py-5">

          {/* Name */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Name
            </label>
          </div>
          {/* Name Alert */}
          {formik.errors.name && formik.touched.name ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.name}
            </div> : null
          }

          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Email
            </label>
          </div>
          {/* Email Alert */}
          {formik.errors.email && formik.touched.email ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.email}
            </div> : null
          }

          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Password
            </label>
          </div>
          {/* Password Alert */}
          {formik.errors.password && formik.touched.password ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.password}
            </div> : null
          }

          {/* rePassword */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.rePassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              name="rePassword"
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your rePassword
            </label>
          </div>
          {/* rePassword Alert */}
          {formik.errors.rePassword && formik.touched.rePassword ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.rePassword}
            </div> : null
          }

          {/* Phone */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={formik.values.phone}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="phone"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Phone
            </label>
          </div>
          {/* Phone Alert */}
          {formik.errors.phone && formik.touched.phone ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {formik.errors.phone}
            </div> : null
          }

          {/* API Alert */}
          {error ?
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
              {error}
            </div> : null
          }
          {/* Submit Button */}
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Submit'
            )}
          </button>

        </form>
      </div>
    </>
  )
}