import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import React from 'react'
import Navbar from './components/Navbar'
import MainSection from './MainSection'
import AddProjectForm from './AddProject'
import "./App.css"
import { Routes, Route } from 'react-router-dom'
import HarkDashboard from './HarkDashboardBlack'
import Login from './Login'
import LandingPage from './LandingPage'
import Workspace from './Workspace'
import Signup from './Signup'

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<MainSection />} /> */}
        <Route path="/add-project" element={<AddProjectForm />} />
        <Route path="/dashboard" element={<HarkDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<LandingPage />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App