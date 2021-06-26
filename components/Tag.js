import React from 'react'

const Tag = ({ name, colour }) => {

    return (
        <div
            style={{
                height: '50px',
                padding: '0 10px',
                background: colour
            }}>
            {name}
        </div>
    )
}

export default Tag
