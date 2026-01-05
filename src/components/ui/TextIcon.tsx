interface TextIconProps {
    text: string;
    settings: {
        textColor: string;
        color: string;
    };
}

const TextIcon = ({ text, settings }: TextIconProps) => {
    return (

        <div className={"flex justify-center"}>
            <div className="flex items-center justify-center font-bold uppercase rounded-full text-xs"
                style={{ color: settings.textColor, background: settings.color, height: '50px', width: '50px' }}>
                {text}
            </div>
        </div>

    )
}

export default TextIcon