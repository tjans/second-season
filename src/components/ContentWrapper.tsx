import React from 'react'
// libraries
import { motion } from "framer-motion";

interface ContentWrapperProps {
    children: React.ReactNode;
    align?: "left" | "center" | "right" | "justify";
    noPadding?: boolean;
    title?: string;
    className?: string;
}

const ContentWrapper: React.FC<ContentWrapperProps> = (props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ textAlign: props.align ?? "left" }}
            className={props.className}
        >
            <main className={"mt-4 pb-28" + (props.noPadding ? "" : " px-4")}>
                {props.children}
            </main>
        </motion.div>
    )
}

export default ContentWrapper