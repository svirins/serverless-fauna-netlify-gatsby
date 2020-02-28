import React, { useContext } from "react";
import { Router, Link } from "@reach/router";
import { IdentityContext } from "../../identity-context";
import { Heading, Button, Flex, NavLink } from "theme-ui";

let Dash = () => {
  const { user } = useContext(IdentityContext);
  return <div>Dash hasUser: {user && user.user_metadata}</div>;
};

let DashLoggedOut = props => {
  const { identity: netlifyIdentity } = useContext(IdentityContext);

  return (<Flex as="nav">
  <NavLink as={Link} to="/" p={2}>
    Home
  </NavLink>
  <NavLink as={Link} to="/app" p={2}>
    Dashboard
  </NavLink>
  {user && (
    <NavLink href="#!" p={2}>
      {user.user_metadata.full_name}
    </NavLink>
  )}
</Flex>
    <Flex sx={{ flexDirection: "column", padding: 3 }}>
      <Heading as="h1">Get Stuff done</Heading>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => {
          netlifyIdentity.open();
        }}
      >
        Log in
      </Button>
    </Flex>
  );
};

export default props => {
  return (
    <Router>
      <Dash path="/app" />
    </Router>
  );
};
