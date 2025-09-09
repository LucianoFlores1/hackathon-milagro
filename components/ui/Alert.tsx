"use client"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type AlertProps = {
    type: "success" | "error"
    message: string
    onClose: () => void
}

export default function Alert({ type, message, onClose }: AlertProps) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <AnimatePresence>
            {message}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 transition-all
                ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
                {message}
            </motion.div>
        </AnimatePresence>
    )
}