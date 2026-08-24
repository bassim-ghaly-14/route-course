import { useState, useContext } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signUp } from '../../api/auth'
import { getApiErrorMessage } from '../../api/apiError'
import { useNavigate, Navigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function Register() {
  let navigate = useNavigate()
  const { saveUserToken, isAuthenticated } = useContext(UserContext)
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
      .max(50, 'Too Long! Maximum 50'),

    email: Yup.string()
      .required('Email is Required')
      .email('Invalid Email'),

    // VERIFIED against the live API: the server accepts passwords longer
    // than 9 chars and containing symbols/mixed case (e.g. "Xyz987@long"),
    // so the old /^[A-Z][a-z0-9]{3,8}$/ regex was rejecting VALID
    // credentials client-side. Only enforce a sane minimum here; the server
    // remains the authority on the real policy.
    password: Yup.string()
      .required('Password is Required')
      .min(6, 'Minimum 6'),

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
    seterror(null)

    // API CALL to Register
    const data = await signUp(val)

    // VERIFIED API contract: signup returns { message, user, token }.
    // Defensive guard: only establish a session when the token is present
    // and decodable (saveUserToken validates and returns false otherwise).
    if (data?.token && saveUserToken(data.token)) {
      // Registered AND signed in → go to the app root.
      navigate('/', { replace: true })
    } else {
      // Registration succeeded but no usable token came back: fall back to
      // a normal login. Never persist an invalid token.
      navigate('/login')
    }
  } catch (err) {
    console.error("API ERROR:", err.response?.data)
    seterror(getApiErrorMessage(err))
  } finally {
    setloading(false)
  }
}

  let formik = useFormik({
    initialValues: user,
    onSubmit: submitForm,
    validationSchema: validate
  })

  // Already signed in? No need to show the registration form again.
  // (Kept after hooks so hook order stays stable.)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <div className="page-container py-16 sm:py-20">
        <div className="card mx-auto max-w-md p-6 sm:p-8">
          <h1 className="section-header mb-2">
            Register Now
          </h1>

          <p className="mb-6 text-sm text-muted">
            Create your TRADO account.
          </p>

          <form onSubmit={formik.handleSubmit} noValidate>

            <Input
              name="name"
              label="Enter Your Name"
              autoComplete="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name ? formik.errors.name : undefined}
            />

            <Input
              name="email"
              label="Enter Your Email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : undefined}
            />

            <Input
              name="password"
              label="Enter Your Password"
              type="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : undefined}
            />

            <Input
              name="rePassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rePassword ? formik.errors.rePassword : undefined}
            />

            <Input
              name="phone"
              label="Enter Your Phone"
              type="tel"
              autoComplete="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone ? formik.errors.phone : undefined}
            />

            {/* API Alert */}
            {error ?
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-error" role="alert">
                {error}
              </div> : null
            }

            <Button type="submit" loading={loading} className="mt-2 w-full">
              {loading ? 'Creating account...' : 'Submit'}
            </Button>

          </form>
        </div>
      </div>
    </>
  )
}

