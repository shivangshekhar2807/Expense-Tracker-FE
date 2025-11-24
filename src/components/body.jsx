import React, { useEffect } from 'react'
import Navbar from './navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constant';

const Body = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const refresh=useSelector((state)=>state.refresh)
   
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch(`${BASE_URL}/Profile`, {
              method: "GET",
              credentials: "include", 
            });

           
            if (!res.ok) {
              if (res.status === 401) {
                console.log("401 detected");
                navigate("/Auth");
                return;
              }
              throw new Error(`Fetch Profile Failed (${res.status})`);
            }

           
            const data = await res.json();

            console.log("res......", data);

            
            dispatch(addUser(data.Data));
          } catch (err) {
            console.error("errrrrrr", err);
            console.log("Other error:", err.message || err);
          }
        };

        fetchUser();

    },[refresh])

  return (
      <div>
          <Navbar></Navbar>

          <Outlet></Outlet>
    </div>
  )
}

export default Body;