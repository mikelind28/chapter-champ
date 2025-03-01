//imports 
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
import { REMOVE_USER } from "../graphql/mutations";
import { User } from "../interfaces/User";
import { UserRoundX } from "lucide-react";
import ConfirmationDialog from "../components/ConfirmDialog";
import { useState } from "react";


//function to fetch users and perform delete action on the user

export default function ManageUsers() {

    //Call GET_USERS Graphql query to pull users including Admins
    const {loading,data,refetch} = useQuery(GET_USERS);

    //Call REMOVE_USERS Graphql Mutation when a user is deleted.Since this is a Admin functionality and Users aren't going to be deleted
    //a immediate fetch happens to refresh the list
    const [removeUser] = useMutation(REMOVE_USER,{onCompleted:() => {refetch()}});

    //State variable to maintain for Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    //State variable to maintain deletedUser - initially empty string
    let [deletedUser, setDeletedUser] = useState("");

    //method to remove user and set DeletedUser back to empty string and Dialog to false
    const handleConfirm = () => {
      // Call removeUser once the user confirms for deletion
      removeUser({variables:{userId:deletedUser}})
      // Set deletedUser back to empty
      setDeletedUser("");
      //Set Dialog to false
      setIsDialogOpen(false);
    };

    const handleClose = () => {
      //Simply close the dialog when cancelled
      setIsDialogOpen(false);
    };
    
    //Checks for loading flag and prints Loading while the data is getting fetched
    if (loading)
    {
      return <div> Loading.. </div>
    }
   
    //Delete User functionality - A confirmation dialog is provided before deletion
    const deleteUser = (id: string) => {
      //Set Deleted User State
      setDeletedUser(id);
      //Set Dialog State to True
      setIsDialogOpen(true);
    }

    //Display Users data and place a delete user icon using Lucide react 
    return (
      <div>
        <h1> Manage Users</h1>   
        <table className="usertable-container">
          <thead>
            <tr className="userheader">
              <th> Username </th>
              <th> Email </th>
              <th> Favourite Count </th>
              <th> Want to Read </th>
              <th> Current Reading </th>
              <th> Finished Reading </th>
              <th> Is Admin? </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody>
            {data?.getUsers.map((user:User) => (
              <tr key={String(user._id)}>
                <td className="userrow">{user.username}</td>
                <td>{user.email}</td>
                <td>{String(user.favoriteCount)}</td>
                <td>{String(user.wantToReadCount)}</td>
                <td>{String(user.currentlyReadingCount)}</td>
                <td>{String(user.finishedReadingCount)}</td>
                <td>{ user.isAdmin ? "True" : "False" }</td>
                <td>
                    { !user.isAdmin ? <button type='button' id='DeleteBtn' onClick ={() => deleteUser(String(user._id))}> < UserRoundX ></UserRoundX> </button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Define ConformationDialog and define methods for each action - open, onClose and onConfirm and set the prompt message */}
        <ConfirmationDialog
                open={isDialogOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                message="Are you sure you want to delete this user?"
            />
      </div>
    );
  };   
 

  