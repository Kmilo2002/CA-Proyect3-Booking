import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from '../HomePage/Home'
import Login from '../Login/Login'
import ModifyUser from '../ModifyUser/ModifyUser'
import ConfirmationData from '../Payment/Payment'
import Register from '../Register/Register'
import UserProfile from '../UserProfile/UserProfile'
import EraseUser from '../EraseUser/EraseUser'
import Loggings from '../Loggings/Loggings'
import LoggingRegister from '../LoggingRegister/LoggingRegister'
import LoggingsSearch2 from '../LoggingsSearch/LoggingsSearch2'
import LoggingsSearch from '../LoggingsSearch/LoggingsSearch'
import Logging_Details from '../LoggingDetails/Logging_Details'
import Payment from '../Payment/Payment'



const Pages = () => {
  return (
  
        <Routes>
            <Route path = '/' element = {<Home />} />
            <Route path = '/login' element = {<Login />} />
            <Route path = '/register' element = {<Register />} />
            <Route path = '/profile' element = {<UserProfile />} />
            <Route path = '/modify_user' element = {<ModifyUser />} />
            <Route path = '/confirmReserv' element = {<ConfirmationData/>}/>
            <Route path = '/erase_user' element = {<EraseUser />} />
            <Route path = '/loggings' element = {<Loggings />} />
            <Route path = '/loggings_search' element = {<LoggingsSearch />} />
            <Route path = '/loggings_search2' element = {<LoggingsSearch2 />} />
            <Route path = '/logging_register' element = {<LoggingRegister />} />
            <Route path = '/loggings/:loggingId' element = {<Logging_Details />} />
            <Route path = '/payment' element = {<Payment />} />
        </Routes>
  )
}

export default Pages