/* eslint-disable import/no-anonymous-default-export */
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default () => useContext(AuthContext);