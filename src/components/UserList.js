import React from 'react';
import {UserListContainer, UserListItem, H2, UserListItemContainer, } from '../styles/UsersListStyles';

const UserList = ({ users }) => {
  return (
    <UserListContainer>
      <H2>Members</H2>
      <UserListItemContainer>
      {users.map((user, index) => (
        <UserListItem key={index}>{user.userData.username}</UserListItem>
      ))}
      </UserListItemContainer>
    </UserListContainer>
  );
};

export default UserList;

