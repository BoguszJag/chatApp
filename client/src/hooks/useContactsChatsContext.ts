import { useContext } from "react";
import ContactsChatsContext from "../context/ContactsChatsProvider";
import { ContactsChatsContextType } from "../@types/ContactsChatsContext";

const useContactsChats = () => {
  const context = useContext(ContactsChatsContext) as ContactsChatsContextType;
  return context;
};

export default useContactsChats;