import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../auth/authOptions'
import { RegistrationForm } from './Form'

const RegisterForm = async () => {

  return (
    <div><RegistrationForm /></div>
  )
}

export default RegisterForm