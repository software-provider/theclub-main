import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table } from "web3uikit";
import { Link } from "react-router-dom";

const Proposal = () => {
  const [votes, setVotes] = useState([
    [
      "0x4d2044D8D568c1644158625930De62c4AbBB004a",
      <Icon fill="#268c41" size={24} svg="checkmark" />,
    ],
    [
      "0x4d2044D8D568c1644158625930De62c4AbBB004a",
      <Icon fill="#268c41" size={24} svg="checkmark" />,
    ],
    [
      "0x4d2044D8D568c1644158625930De62c4AbBB004a",
      <Icon fill="#d93d3d" size={24} svg="arrowCircleDown" />,
    ],
    [
      "0x4d2044D8D568c1644158625930De62c4AbBB004a",
      <Icon fill="#d93d3d" size={24} svg="arrowCircleDown" />,
    ],
    [
      "0x4d2044D8D568c1644158625930De62c4AbBB004a",
      <Icon fill="#d93d3d" size={24} svg="arrowCircleDown" />,
    ],
  ]);

  return (
    <>
      <div className="contentProposal">
        <div className="proposal"> {/* Provides the frontend with a method to return to the home page */}
          <Link to="/">
            <div className="backHome">
              <Icon fill="#ffffff" size={20} svg="chevronLeft" />
              Overview
            </div>
          </Link>
          <div>Should we accept the offer to buyout the DAO?</div>
          <div className="proposalOverview">
            <Tag color={"red"} text={"Rejected"} />
            <div className="proposer">
              <span>Proposed by </span>
              <Tooltip content={"0xEthAddress"}>
                <Blockie seed={"Exact Eth Address"} />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="widgets">
          <Widget info={30} title="Votes for">
            <div className="extraWidgetInfo">
              <div className="extraTitle">{75}%</div>
              <div className="progress">
                <div
                  className="progressPercentage"
                  style={{ width: `${75}%` }}
                ></div>
              </div>
            </div>
          </Widget>
          <Widget info={10} title="Votes Against">
            <div className="extraWidgetInfo">
              <div className="extraTitle">{25}%</div>
              <div className="progress">
                <div
                  className="progressPercentage"
                  style={{ width: `${25}%` }}
                ></div>
              </div>
            </div>
          </Widget>
        </div>
        <div className="votesDiv">
          <Table
            style={{ width: "60%" }}
            columnsConfig="90% 10%"
            data={votes}
            header={[<span>Address</span>, <span>Vote</span>]}
            pageSize={5}
          />
          <Form
            style={{
              width: "35%",
              height: "250px",
              border: "1px solid rgba(6, 158, 252, 0.2)",
            }}
            buttonConfig={{
              isLoading: false,
              loadingText: "Casting Vote",
              text: "Vote",
              theme: "secondary",
            }}
            data={[
              {
                inputWidth: "100%",
                name: "Cast Vote",
                options: ["For", "Against"],
                type: "radios",
                validation: {
                  required: true,
                },
              },
            ]}
            onSubmit={(e) => {
              alert("Vote cast!");
            }}
            title="Cast Vote"
          />
        </div>
     </div>
     <div className="voting"></div>
    </>
  );
};

export default Proposal;
