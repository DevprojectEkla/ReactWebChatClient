import React from 'react';
import styled from 'styled-components';

const UserListContainer = styled.div`
  width: 200px; /* Adjust the width as needed */
  max-height: 300px; /* Limit the maximum height to prevent it from taking up too much space */
  overflow-y: auto;
  background-color: rgba(0, 0, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
`;

const UserListItem = styled.div`
  color: #000;
  padding: 5px;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
`;

const H2 = styled.h2`
  text-align: center;
padding:10px;
  margin-bottom: 10px;
`;

const UserList = ({ users }) => {
  return (
    <UserListContainer>
      <H2>Présents</H2>
      {users.map((user, index) => (
        <UserListItem key={index}>{user.userData.username}</UserListItem>
      ))}
    </UserListContainer>
  );
};

export default UserList;

