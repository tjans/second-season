import { IoAddCircleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

interface FloatingAddButtonProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    to: string;
    className?: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick, to, className }) => {
    return (
        <div className={`flex justify-center pb-4 ${className}`} onClick={onClick}>
            <Link to={to}>
                <IoAddCircleSharp className="text-4xl text-black drop-shadow-md" />
            </Link>
        </div>
    )
}

export default FloatingAddButton