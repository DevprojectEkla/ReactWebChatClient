import styled from 'styled-components';
import {HOVER_EFFECT} from '../config';
import { make_rgba } from "../styles/colors" 
const colors = require("../styles/colors");

export const UserListItemContainer = styled.div`
  display: flex;
flex-direction: row;
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
  background-color: ${make_rgba(colors.GBLUE_2_1,".7")};
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
${HOVER_EFFECT(colors.GBLUE_4)}
`;

export const UserListItem = styled.div`
color: rgb(230,230,255);
  padding: 4px;
  margin: 2px;
  ${HOVER_EFFECT("rgba(220,220, 235, 1)","rgba(0,0,30,.8)")};
  border-radius: 4px;
`;

export const H2 = styled.h3`
  text-align: center;
margin-top:1px;
  margin-bottom: 10px;
`;

