import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { addRefresh } from "../utils/refresh";
import { Wallet, X, Crown } from "lucide-react";

const Navbar = () => {

  const user = useSelector((state) => state.user);
  const refresh=useSelector((state)=>state.refresh)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [active, setActive] = useState("Dashboard");
    const [wallet, setWallet] = useState(0);
  const [isPremium, setIsPremium] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
    const [showPopup, setShowPopup] = useState(false);


    const location = useLocation();
    const path = location.pathname;

    console.log(isPremium);
    
    useEffect(() => {
        if (!path) {
            return;
        }
        if (path == "/") {
          setActive("Dashboard");
        } else if (path == "/leaderboard") {
          setActive("Leaderboard");
        } else if (path == "/report") {
          setActive("Report");
        } else if (path == "/profile") {
          setActive("Profile");
        } else if (path == "/Expense/AI") {
          setActive("AI");
        }
    },[path])

    
    const handleLogout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/Logout`, {
                method:"POST",
              credentials: "include",
            });

            if (res.ok) {
                dispatch(removeUser());
                dispatch(addRefresh());
                navigate("/Auth")
            }
        }
        catch (err) {
            console.log(err)
        }
    }
  
  const getProfile = async ()=>{
    try {
      const res = await fetch(`${BASE_URL}/Profile`, {
        credentials:"include"
      })

      if (!res.ok) {
        throw new Error("Profile not feched")
      }

      const data = await res.json();
      
      setWallet(data.Data.Wallet_Balance);
      setIsPremium(data.Data.Premium);

    }
    catch (err) {
      console.log(err)
     }
  }

  useEffect(() => {
    getProfile();
  }, [refresh]);
  
  const handlePremium = async (amount) => {
    try {
      const res = await fetch(`${BASE_URL}/Razorpay/Payment/OrderId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({amount,type:"Premium"}),
      });

      if (!res.ok) {
        throw new Error("payment failed")
      }

      const data = await res.json();

      const options = {
        key: data.keyId,
        amount: amount * 100,
        currency: "INR",
        name: data.name,

        order_id: data.data,

        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },

        theme: {
          color: "#F37254",
        },
        handler: getProfile,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
    catch (err) {
      console.log(err)
    }
  }


  const handleRecharge = async (amount) => {
     try {
       const res = await fetch(`${BASE_URL}/Razorpay/Payment/OrderId`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({ amount, type: "Recharge" }),
       });

       if (!res.ok) {
         throw new Error("payment failed");
       }

       const data = await res.json();

       const options = {
         key: data.keyId,
         amount: amount * 100,
         currency: "INR",
         name: data.name,

         order_id: data.data,

         prefill: {
           name: data.name,
           email: data.email,
           contact: data.phone,
         },

         theme: {
           color: "#F37254",
         },
         handler: getProfile,
       };

       const rzp = new window.Razorpay(options);
       rzp.open();
     } catch (err) {
       console.log(err);
     }
  }

  const handleLeaderboardClick = (e) => {
    if (!isPremium) {
      e.preventDefault();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };


    
  return (
    <>
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 tracking-tight"
        >
          ExpenseTracker
        </Link>

        {user && (
          <>
            <div className="flex space-x-6">
              <Link
                to="/"
                className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                  active === "Dashboard"
                    ? "text-green-600 underline"
                    : "text-gray-800 hover:text-green-600 hover:underline"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                  active === "Profile"
                    ? "text-green-600 underline"
                    : "text-gray-800 hover:text-green-600 hover:underline"
                }`}
              >
                Profile
              </Link>
              {/* <Link
                to="/leaderboard"
                className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                  active === "Leaderboard"
                    ? "text-green-600 underline"
                    : "text-gray-800 hover:text-green-600 hover:underline"
                }`}
              >
                LeaderBoard
              </Link> */}

              {/* Leaderboard with Crown Icon */}
              <div className="relative">
                <Link
                  to={isPremium ? "/leaderboard" : "#"}
                  onClick={handleLeaderboardClick}
                  className={`flex items-center space-x-1 font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                    active === "Leaderboard"
                      ? "text-green-600 underline"
                      : "text-gray-800 hover:text-green-600 hover:underline"
                  }`}
                >
                  <span>Leaderboard</span>
                  <Crown
                    size={16}
                    className={`${
                      isPremium ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                </Link>

                {/* Popup now attached below Leaderboard */}
                {showPopup && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1.5 rounded-lg shadow-md text-sm whitespace-nowrap z-50 animate-fade-in-out">
                    Buy Premium membership to view Leaderboard 👑
                  </div>
                )}
              </div>
              <Link
                to="/report"
                className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                  active === "Report"
                    ? "text-green-600 underline"
                    : "text-gray-800 hover:text-green-600 hover:underline"
                }`}
              >
                Report
              </Link>

              <Link
                to="/Expense/AI"
                className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                  active === "AI"
                    ? "text-green-600 underline"
                    : "text-gray-800 hover:text-green-600 hover:underline"
                }`}
              >
                AI
              </Link>
              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-medium">
                <button
                  onClick={() => setShowModal(true)} // 👈 or any action you want
                  className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-medium hover:bg-green-200 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  <Wallet size={16} />
                  <span>{wallet}</span>
                </button>
              </div>
            </div>

            {/* Logout + User Info (grouped together) */}
            <div className="flex items-center space-x-4">
              {!isPremium && (
                <button
                  className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 font-semibold border border-yellow-500"
                  onClick={() => handlePremium(500)}
                >
                  ⭐ Buy Premium
                </button>
              )}
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user.photoUrl ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <span className="text-gray-700 font-medium">
                  {user.name || "User"}
                </span>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Wallet Recharge Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
              💰 Recharge Wallet
            </h2>

            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              disabled={!rechargeAmount}
              onClick={() => {
                handleRecharge(Number(rechargeAmount));
                setShowModal(false);
                setRechargeAmount("");
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}


    </>
  );
};

export default Navbar;
