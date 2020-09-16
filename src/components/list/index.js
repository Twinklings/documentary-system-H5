
import React, { useState, useEffect } from 'react';
import './index.css'

function ListItem(props) {
    return (
        <>
            {
                props.data.map((item,key)=>{
                    return(
                        <div key={key} className={"list-item"}>
                            <div className={"list-left-title"}>{item.title}</div>
                            <div className={"list-right-content"}>{item.name}</div>
                        </div>
                    )
                })
            }
        </>
   );
}

export default ListItem