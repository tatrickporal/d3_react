import React from 'react';
import Button from './Button'
import './Button.css'
function ButtonsContainer(props){
        return(
            <div className="buttons-container">
                {props.buttons.map(button => 
                    <Button key={button} name={button} callback={props.callback}/>
                )}
            </div>
        );
}
export default ButtonsContainer;