import React from 'react';
import classNames from 'classnames';
import {Login} from '../components/Login';

const LoginView = () => {
  const loginContainer = classNames(
    'View--Login',
    'flex',
    'justify-center',
    'items-center',
    'min-h-screen',
    'text-center,',
  );

  return (
    <div className={loginContainer}>
      <div className="text-center">
        <h1 className="mt-0">
          <svg className="w-full h-6">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={'rgb(64, 76, 154)'} />
                <stop offset="100%" stopColor={'rgb(2, 176, 237)'} />
              </linearGradient>
            </defs>
            <text
              fill="url(#gradient)"
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              children={'Kid First Data Resource Portal'}
            />
          </svg>
        </h1>
        <div className="Card--Login">
          <h2 className="Card--title pb-4">Log in</h2>
          <div className="pb-2">
            <Login />
          </div>
          <hr />
          <p className="max-w-full">
            <span>New to Kids First Data Resource Portal?</span>
            <a className="no-underline" href="/">
              {' '}
              Join now >
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
