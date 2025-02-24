import { Outlet } from 'react-router-dom';
// import { useState } from "react";
import logo from "./assets/images/logo.png"
import Navbar from "./components/Navbar";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // const [user, setUser] = useState<null | { name: string; avatar?: string }>(null);

  // const handleLogin = () => {
  //   setUser({
  //     name: "John Doe",
  //     avatar: "https://i.pravatar.cc/400",
  //   });
  // };

  // const handleLogout = () => {
  //   setUser(null);
  // };

  return (
    <ApolloProvider client={client}>
      <Navbar
        logo={logo}
        logoSize={100}
        links={[{ label: "Home", path: "/" }]}
        // user={user}
        // onLogout={handleLogout}
        // onLogin={handleLogin}
      />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
