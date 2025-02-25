import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
import { User } from "../interfaces/User"

export default function ManageUsers() {
    const {loading,data} = useQuery(GET_USERS)
    if (loading)
    {
      return <div> Loading.. </div>
    }
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Manage Users</h1>
        {
          data?.getUsers.map((user:User) =>{
            return <div>{user.email}</div>
          })
        }
      </div>
    );
  }
  