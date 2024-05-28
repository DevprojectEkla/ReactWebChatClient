import styled from 'styled-components';

export const UserListItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

export const UserListContainer = styled.div`
  width: auto 
  max-height: 300px; /* Limit the maximum height to prevent it from taking up too much space */
  overflow-y: auto;
  background-color: rgba(0, 0, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const UserListItem = styled.div`
  color: #000;
  padding: 5px;
  margin-right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
`;

export const H2 = styled.h2`
  text-align: center;
padding:10px;
  margin-bottom: 10px;
`;

