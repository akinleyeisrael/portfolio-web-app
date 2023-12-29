import React from 'react'
import Form from './Form'
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/auth/authOptions';

const login = async () => {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/')
  }
  return (
    <section>
      <Form />

    </section>
  )
}

export default login