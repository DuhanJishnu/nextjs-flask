import React from "react";

interface Card{
    id : number,
    name : string,
    email : string
}

const CardComponent : React.FC<{card : Card}> = ({card}) => {
    return(
        <div className="card p-10">
            <div>ID : {card.id}</div>
            <div>Name : {card.name}</div>
            <div>Email : {card.email}</div>
        </div>
    );
};

export default CardComponent;