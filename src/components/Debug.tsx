const Debug = ({data, title}: any) => {
    
    return (
        <div className="bg-gray-200 p-4 rounded-lg mb-4 overflow-x-auto">
            {title ? <div className="font-bold">{title}</div> : null}
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

export default Debug