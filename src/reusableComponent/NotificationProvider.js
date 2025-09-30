import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = "success") => {
        setNotification({ message, type });

        // auto-hide after 3 sec
        setTimeout(() => setNotification(null), 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {/* Notification UI */}
            <AnimatePresence>
                {notification && (
<motion.div
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 40, scale: 0.95 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className={`fixed bottom-6 left-[40%] -translate-x-1/2 px-4 py-2 shadow-lg z-50 text-white text-sm sm:text-base font-medium 
    inline-flex items-center gap-3 whitespace-nowrap text-center
    ${notification.type === "success" ? "bg-amber-600" : "bg-red-600"}`}
>
  {/* Icon depending on type */}
  {notification.type === "success" ? (
    <Check size={18} className="text-green-400" />
  ) : (
    <X size={18} className="text-red-200" />
  )}

  {/* Message */}
  <span>{notification.message}</span>

  {/* Close Button */}
  
</motion.div>

                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};
