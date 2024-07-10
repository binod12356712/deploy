import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalTransactions from "./ModalTransactions";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize userId using local storage
  const userId = localStorage.getItem("userId");
  const walletAddress = localStorage.getItem("walletAddress");
  //---------------------------------------transactions------------------------------//
  const login = localStorage.getItem("authToken");
  const [allTransaction, setAllTransaction] = useState([]);
  const [opentransaction, setopentransaction] = useState(false);
  const [datatransaction, setdatatransaction] = useState(null); // Initialize datatransaction with null

  const getallTransaction = async () => {
    try {
      const response = await axios.post(
        "http://77.37.86.134:3001/wallet/getwalletTransaction",
        {
          login: login,
          userId: userId,
        }
      );
      console.log("transactions");
      console.log(response.data);
      setAllTransaction(response.data.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (login && userId) {
      getallTransaction();
      getAmount();
    }
  }, [login, userId]);

  //-------------------------------------wallet------------------------------------------//
  const [userdata, setuserdata] = useState({});
  const [url, seturl] = useState("");
  const [balUSD, setbalUSD] = useState();
  const [invUSD, setinvUSD] = useState();

  const getAmount = async () => {
    try {
      const response = await axios.post(
        "http://77.37.86.134:3001/wallet/getwalletAmount",
        {
          login: login,
          userId: userId,
        }
      );
      console.log("current balance");

      // Assuming response.data[0].Amount and response.data[0].Invested are in INR
      const amountInUSD = convertINRtoUSD(response.data[0].Amount);
      const investedInUSD = convertINRtoUSD(response.data[0].Invested);

      setbalUSD(
        amountInUSD.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        })
      );
      setinvUSD(
        investedInUSD.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        })
      );
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  // Function to convert INR to USD (for example purposes)
  const convertINRtoUSD = (amountINR) => {
    // You would replace this with your actual conversion logic
    // For demonstration, let's assume a simple conversion rate
    const conversionRate = 0.014; // 1 INR = 0.014 USD (example rate)
    return amountINR * conversionRate;
  };

  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        const response = await axios.post(
          "http://77.37.86.134:3001/dashboard/userdetails",
          {
            UserId: userId,
          }
        );
        console.log("response we get from dashboard");
        console.log(response.data);
        setuserdata(response.data);
        if (response.data.userProfile && response.data.userProfile.length > 0) {
          seturl(response.data.userProfile[0].url);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userId) {
      fetchuserdata();
    }
  }, [userId]);

  //-------------------------------------wallet-----------------------------------------//

  const handleupdate = () => {
    navigate("/profileUpdate", { state: { id: userId } });
  };

  return (
    <div className="bg-[#171b26] h-content">
      {opentransaction && (
        <ModalTransactions
          fun={{ data: datatransaction, open: setopentransaction }}
        />
      )}

      {userdata.Data ? (
        <div className="pt-[100px] pb-[80px] bg-[#1d2230] w-[70%] mx-auto h-[100%] ">
          <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] mx-auto m-5 bg-[#272e41] p-5 rounded-lg ">
            <div
              className="w-[150px] h-[150px] bg-cover m-5 mx-auto border-2"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
            <div className="text-white m-5 mx-auto">
              <div className="m-2 font-semibold grid grid-cols-1 md:grid-cols-4 ">
                <div className="mr-3 font-bold">Name </div>
                <div className="grid grid-cols-3 mx-auto">
                  {userdata.Data.first_name} {userdata.Data.last_name}
                </div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 md:grid-cols-4  ">
                <div className="mr-3 font-bold">Mobile </div>
                <div className="grid grid-cols-3 mx-auto">
                  {userdata.Data.mob}
                </div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 lg:grid-cols-4 ">
                <div className="mr-3 font-bold">Email </div>
                <div className="text-[12px] sm:text-[13px] md:text-[16px] grid grid-cols-3 ">
                  {userdata.Data.email}
                </div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 lg:grid-cols-4 ">
                <div className="mr-3 font-bold">User Id </div>
                <div className="text-[12px] sm:text-[13px] md:text-[16px] grid grid-cols-3 ">
                  {userId}
                </div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 lg:grid-cols-4 ">
                <div className="mr-3 font-bold">Wallet Address </div>
                <div className="text-[12px] sm:text-[13px] md:text-[16px] grid grid-cols-3 ">
                  {walletAddress}
                </div>
              </div>
              <button
                className="bg-[#209fe4]  w-[100%] mx-auto p-1 mt-2  rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
                onClick={handleupdate}
              >
                update Profile
              </button>
            </div>
          </div>

          <div className="w-[90%] mx-auto bg-[#272e41] p-5  rounded-lg mb-4">
            <div className="font-bold text-white text-center  md:text-left text-[20px] md:text-[22px] mb-2">
              Wallet
            </div>
            <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 pb-3">
              <div className="font-semibold  text-[#dedddd] text-center text-[20px] md:text-[22px] mb-2">
                <div>Balance</div>
                <div>{balUSD}</div>
              </div>
              <div className="font-semibold w-[80%] mx-auto grid grid-cols-1 text-[#dedddd] text-center text-[20px] md:text-[22px]">
                <div>Invested</div>
                <div>{invUSD}</div>
              </div>
            </div>
          </div>

          <div className="w-[90%] mx-auto bg-[#272e41] p-5  rounded-lg ">
            <div className="font-bold text-white text-center  md:text-left text-[20px] md:text-[22px] mb-8">
              Transactions
            </div>
            <div className=" w-[80%] mx-auto max-h-[400px] overflow-y-scroll">
              {allTransaction.map((value, key) => (
                <div
                  key={key}
                  onClick={() => {
                    setopentransaction(true);
                    setdatatransaction(value);
                  }}
                >
                  <div className="bg-[#171b26] rounded-lg text-white m-3 p-4 md:grid md:grid-cols-3 ">
                    <div className="w-[100%] md:w-[100%]">
                      <div className="font-semibold text-white text-center text-[14px] md:text-[17px] mb-2 ">
                        {value.CoinName}
                      </div>
                      <div className=" w-[50px] h-[50px] mx-auto ">
                        <img src={value.img} alt=""></img>
                      </div>

                      {value.type === "Buy" ? (
                        <div className="text-[#26a69a] font-semibold text-center text-[14px] md:text-[17px] mb-2 mt-2">
                          {value.type}
                        </div>
                      ) : (
                        <div className="text-[#c12f3d] font-semibold  text-center text-[14px] md:text-[17px] mb-2 mt-2">
                          {value.type}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:grid  md:grid-cols-1 lg:grid-cols-2  col-span-2">
                      <div className="">
                        <div className="text-center font-semibold lg:text-[20px] lg:m-2">
                          Quantity
                        </div>
                        <div className="text-center font-bold lg:m-2">
                          {value.Quantity}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-center font-semibold lg:m-2 lg:text-[20px]">
                          Amount
                        </div>
                        <div className="text-center font-bold lg:m-2">
                          ${value.Amount.toFixed(2)}{" "}
                          {/* Display amount in USD */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
