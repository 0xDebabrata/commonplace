import React from 'react'

const Tag = ({ name, colour }) => {

    return (
        <div
            style={{
                height: '30px',
                padding: '0 15px',
                marginTop: '5px',
                background: '#'+colour,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '7px',
                margin: '0 5px',
            }}>
            {name}
        </div>
    )
}

export default Tag
