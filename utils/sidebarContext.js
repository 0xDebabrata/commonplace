import { createContext } from "react";

export const SidebarContext = createContext({
  open: false,
  details: {},
  updateSidebar: () => {}
})


