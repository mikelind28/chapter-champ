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
      <div>
        <h1> Manage Users</h1>   
        <table className="usertable-container">
          <thead>
            <tr className="userheader">
              <th> Username </th>
              <th> Email </th>
              <th> Current Reading </th>
              <th> Favourite Count </th>
              <th> Finished Reading </th>
              <th> Want to Read </th>
              <th> Book Count </th>
            </tr>
          </thead>
          <tbody>
            {data?.getUsers.map((user:User) => (
              <tr>
                <td className="userrow">{user.username}</td>
                <td>{user.email}</td>
                <td>{String(user.currentlyReadingCount)}</td>
                <td>{String(user.favoriteCount)}</td>
                <td>{String(user.finishedReadingCount)}</td>
                <td>{String(user.wantToReadCount)}</td>
                <td>{String(user.bookCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
      
 

  