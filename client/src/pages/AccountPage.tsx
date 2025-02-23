import { useEffect, useState } from "react";
import { GET_ME } from "../graphql/queries";
import { useQuery } from '@apollo/client';


export default function AccountPage() {
  // load current user's data
  const { loading, data } = useQuery(GET_ME);
  console.log(loading);
  console.log(data);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data) {
      setUsername(data.me.username);
      setEmail(data.me.email);
    }
  }, [data])

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>My Account</h1>
      <p>Manage your account settings here.</p>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
    </div>
  );
}
