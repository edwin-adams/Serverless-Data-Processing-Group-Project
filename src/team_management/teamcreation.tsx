import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Button, Modal, Select, Space } from "antd";

interface User {
  email: string;
  last_name: string;
  first_name: string;
}

const { Option } = Select;

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [teamName, setTeamName] = useState(null);
  const [teamName, setTeamName] = useState("The jugglers");
  const [users, setUsers] = useState<User[]>([]);
  const [subscribedUsers, setSubsribedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const generateTeamName = async () => {
    try {
      //   const response = await fetch(
      //     "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/testName",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ prompt: "Generate me a unique team name" }),
      //     }
      //   );
      //   const res = await response.json();
      //   setTeamName(res.body);
      //   if (res) {
      setIsModalOpen(true);
      //   }
    } catch (e) {}
  };

  const getSubscribedUsers = async () => {
    try {
      const response = await fetch(
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/getUsers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      console.log(res);
      setSubsribedUsers(res);
    } catch (e) {}
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://akabqf470a.execute-api.us-east-1.amazonaws.com/prod",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      console.log(res.body);
      setUsers(res.body);
    } catch (e) {}
  };

  const sendInvite = async () => {
    const senderName = localStorage.getItem("loggedInName");
    const senderEmail = localStorage.getItem("loggedInEmail");
    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/sendInvite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: teamName,
          email: selectedUsers,
          fromName: senderName,
          fromEmail: senderEmail,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
  };

  const showModal = () => {
    filterUsersByEmail();
    generateTeamName();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    sendInvite();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    setSelectedUsers(value);
  };

  const filterUsersByEmail = () => {
    console.log(users);
    console.log(subscribedUsers);
    const filteredUsers = users.filter((user) =>
      subscribedUsers.includes(user.email)
    );
    console.log(filteredUsers);
    setFilteredUsers(filteredUsers);
  };

  useEffect(() => {
    getAllUsers();
    getSubscribedUsers();
  }, []);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Team
      </Button>
      <Modal
        title={"Team Name: " + teamName}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Invite"
        okButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        Lets add some participants
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="select one country"
          onChange={handleChange}
          optionLabelProp="label"
        >
          {filteredUsers.map((user, index) => (
            <Option value={user.email} label={user.first_name}>
              <Space>
                {user.first_name} {user.last_name}
                <span role="img" aria-label="China">
                  {user.email}
                </span>
              </Space>
            </Option>
          ))}
        </Select>
        <br />
        <br />
      </Modal>
    </>
  );
};

export default Dashboard;
