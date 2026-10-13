import React, { useState } from 'react';
import "./index.scss";

const TabsContainer = (props) => {

    const [activeTab, selectTab] = useState(props.active);

    function handleChange(index) {
        selectTab(index);
    }

    return (
        <div>
            <ul className="tab-header">
                {props.children.map((elem, index) => {
                    let style = index === activeTab ? "selected" : "";
                    return (
                        <li
                            className={style}
                            key={index}
                            onClick={handleChange.bind(this, index)}
                        >
                            {elem.props.title}
                        </li>
                    );
                })}
            </ul>
            <div className="tab">{props.children[activeTab]}</div>
        </div>
    );
};

export default TabsContainer;
