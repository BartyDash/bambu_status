import React from 'react'

const StatusTile = ({ statusTitle, actualTemp, targetTemp, status, errorCode }) => {
    return (
        <div className="flex flex-col justify-center items-center w-[140px] h-[140px] bg-[#504F562B] backdrop-blur-sm rounded-2xl gap-2.5">
            <p>{statusTitle}</p>
            {errorCode == undefined ? (
                <span className="flex flex-col items-center">
                    {actualTemp}°C{targetTemp ? <span className="text-[#454249] text-xs">/{targetTemp}°C</span> : ''}
                </span>
            ) : (
                <p className={status=='PAUSE'?'text-[#FF3131]':(status=='FINISH'?'text-[#00AE41]':'text-[#FFBE31]')}>{status.toLowerCase()}</p>
            )}
        </div>
    )
}

export default StatusTile
