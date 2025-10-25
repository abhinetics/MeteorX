import React from 'react'
import AppRoutes from './assets/routes/AppRoutes'
import { UserProvider } from './contex/user.context'
const App = () => {
  return (

     <UserProvider>
      <AppRoutes  />
     </UserProvider>
  )
}

export default App