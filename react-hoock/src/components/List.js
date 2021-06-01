import React from "react";
import PropTypes from 'prop-types';

const List = ({ list, onChangeStatus }) => {
  return (
    <ul>
      {list.map((item, i) => 
        <li key={item.name}>
          {item.name}
          <input type="checkbox" defaultChecked={item.done} onClick={() => {onChangeStatus(i)}}/>
        </li>
        )}
    </ul>
  )
}

List.propTypes = {
  list: PropTypes.array,
}

export default List;