import { useState, useContext } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signIn } from '../../api/auth'
import { getApiErrorMessage } from '../../api/apiError'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import Input from '../ui/Input'
import Button from '../ui/Button'

// Only allow internal application paths as redirect targets.
function sanitizeReturnTo(raw) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return null
  return raw
}

export default function Login() {
  let navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { saveUserToken, isAuthenticated } = useContext(UserContext)
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)

  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'))

  let user = {
    email: '',
    password: ''
  }

  let validate = Yup.object().shape({
    email: Yup.string()
      .required('Email is Required')
      .email('Invalid Email'),

    // Login must never block valid credentials client-side: the server is
    // the authority on whether a password is correct (the old pattern-based
    // rule locked out users whose real passwords didn't match it).
    password: Yup.string().required('Password is Required'),
  })

async function submitForm(val) {
  try {
    setloading(true)
    // API CALL to Login
    const data = await signIn(val)

    // SUCCESSFUL LOGIN, NOW HOME (or the originally requested page)
    saveUserToken(data.token)

    navigate(returnTo || '/', { replace: true })

  } catch (err) {
  console.error("API ERROR:", err.response?.data)
    // ERROR HANDLING
  seterror(getApiErrorMessage(err))
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

  // Already signed in? No need to show the login form again.
  // (Kept after hooks so hook order stays stable.)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <div className="page-container py-16 sm:py-20">
        <div className="card mx-auto max-w-md p-6 sm:p-8">
          <h1 className="section-header mb-2">
            Login Now
          </h1>

          <p className="mb-6 text-sm text-muted">
            Welcome back to TRADO.
          </p>

          <form onSubmit={formik.handleSubmit} noValidate>

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
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : undefined}
            />

            {error ?
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-error" role="alert">
                {error}
              </div> : null
            }

            <Button type="submit" loading={loading} className="mt-2 w-full">
              {loading ? 'Signing in...' : 'Submit'}
            </Button>

          </form>
        </div>
      </div>
    </>
  )
}