import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}
declare const Button: React.FC<ButtonProps>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
declare const Input: React.FC<InputProps>;

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children?: React.ReactNode;
}
declare const Modal: React.FC<ModalProps>;

interface CardProps {
    children?: React.ReactNode;
    title?: string;
    style?: React.CSSProperties;
}
declare const Card: React.FC<CardProps>;

declare const Cart: React.FC;

export { Button, Card, Cart, Input, Modal };
