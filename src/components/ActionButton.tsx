// React import not needed in modern React with JSX transform
import { Link, useNavigate } from 'react-router-dom';

interface ActionButtonProps {
  text: string;
  bgclass?: string;
  className?: string;
  uniform?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  to?: string;
  path?: string;
  name?: string;
  disabled?: boolean;
  [key: string]: any; // for other button props
}

export function ActionButton(props: ActionButtonProps) {
  const navigate = useNavigate();

  const bgClass = props.bgclass || "bg-defaultBlue border-blueDarken hover:bg-blueDarken";
  let classes = `min-w-24 py-2 px-5 font-bold border rounded-lg ${bgClass} text-white border-b-4 inline-block`;
  if (props.uniform) classes += " w-28";
  if (props.fullWidth) classes += " w-full";

  if (props.className) {
    classes += " " + props.className;
  }

  const handleClick = () => {
    if (props.path) {
      navigate(props.path)
    } else {
      if (props.onClick) props.onClick();
    }
  }

  return (
    <>
      <button name={props.name} onClick={handleClick} className={classes}>
        {props.text}
      </button>
    </>
  );
}

interface ActionLinkProps {
  text: string;
  path: string;
  className?: string;
  onClick?: () => void;
}

export function ActionLink(props: ActionLinkProps) {

  // const { getTeamStyle } = useGameData(); // Disabled - missing dependency

  let classes = "min-w-24 py-2 px-5 font-bold border-b-4 rounded-lg bg-defaultBlue text-white inline-block hover:bg-blueDarken border-blueDarken";
  if (props.className) {
    classes += " " + props.className;
  }

  return (
    <>
      <Link to={props.path} onClick={props.onClick} className={classes}>
        {props.text}
      </Link>
    </>
  );
}