import React from 'react';
import {Icon} from 'kf-uikit';

const TokenList = ({tokens, deleteToken}) => (
  <ul className="min-w-full list-reset">
    {tokens.map(node => (
      <li className="w-full" key={node.node.id}>
        <button onClick={() => deleteToken(node.node.token)}>
          <Icon
            kind="delete"
            className="w-8 cursor-pointer"
            width={18}
            height={18}
          />
        </button>
        <span>{node.node.name}</span>
        <div className="float-right">
          <span className="font-mono bg-lightGrey py-2 px-4">
            {node.node.token}
          </span>
        </div>
      </li>
    ))}
  </ul>
);

export default TokenList;
