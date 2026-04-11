import { Redirect } from 'expo-router'
import React from 'react'

export default function index() {
  // return (
  //   <Onboarding />
  // )
  return <Redirect href="/(auth)/login" />
}