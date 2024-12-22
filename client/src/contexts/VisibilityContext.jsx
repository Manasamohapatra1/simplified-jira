import { createContext, useState, useContext } from "react";

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
    const [visibleButton, setVisibleButton] = useState("both"); 

    return (
        <VisibilityContext.Provider value={{ visibleButton, setVisibleButton }}>
            {children}
        </VisibilityContext.Provider>
    );
};

export const useVisibility = () => {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error("useVisibility must be used within a VisibilityProvider");
    }
    return context;
};
