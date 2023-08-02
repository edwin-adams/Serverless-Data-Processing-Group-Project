import React, { useEffect, useRef, useState } from "react";
import "./leaderboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const Leaderboard = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://k78f41lwc2.execute-api.us-east-1.amazonaws.com/Prod/gamelobby",
          {}
        );
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row mt-2">
          <div className="col-md-12">
            <iframe
              width="960"
              height="720"
              src="https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/3d50798e-55bb-4a50-9400-7dfbebf42c1a?directory_alias=msojitra"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
