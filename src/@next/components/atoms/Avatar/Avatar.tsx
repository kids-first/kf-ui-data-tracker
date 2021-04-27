import React from 'react';
import classnames from 'classnames';

export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export interface IAvatarProps {
    src: string;
    alt: string;
    size?: AvatarSize;
}

const base = classnames('inline-block', 'rounded-full');

const sizes: {[key in AvatarSize]: string} = {
    xsmall: classnames('h-6', 'w-6'),
    small: classnames('h-8', 'w-8'),
    medium: classnames('h-10', 'w-10'),
    large: classnames('h-12', 'w-12'),
    xlarge: classnames('h-14', 'w-14'),
};

const Avatar = ({src, alt, size}: IAvatarProps) => (
    <img className={classnames(base, size && sizes[size])} src={src} alt={alt} />
);

export default Avatar;
