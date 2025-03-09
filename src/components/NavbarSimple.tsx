import {useContext, useState} from 'react';
import {IconAffiliate, IconLogout2, IconMessageCircle, IconSettings, IconUserCircle} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import {auth} from "../firebase.tsx";

import {useNavigate} from "react-router-dom";
import {NavContext} from "../context/NavContext.tsx";

const data = [
    {link: '/chats', label: 'Chats', icon: IconMessageCircle},
    {link: '/chatroom', label: 'Chatroom', icon: IconAffiliate},
];


export function NavbarSimple() {
    const [active, setActive] = useState('Billing');
    const navigate = useNavigate();
    const context = useContext(NavContext);
    if (!context) {
        throw new Error("No COntext")
    }
    const {location, setLocation} = context;


    const signOut = () => {
        auth.signOut();
        navigate("/");
        window.location.reload();
    };

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(e) => {
                e.preventDefault();
                setLocation(item.label);
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5}/>
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                {links}
            </div>
            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => {
                    event.preventDefault()
                }}>
                    <IconSettings className={classes.linkIcon} stroke={1.5}/>
                    <span>Settings</span>
                </a>
                <a href="#" className={classes.link} onClick={(event) => {
                    event.preventDefault();
                    setLocation("Profile");
                }}>
                    {auth.currentUser?.photoURL ?
                        <img src={auth.currentUser?.photoURL} className={classes.linkIcon} stroke={1.5} alt=""/> :
                        <IconUserCircle className={classes.linkIcon} stroke={1.5}/>}
                    <span>Profile</span>
                </a>
                <a href="#" className={classes.link} onClick={(event) => {
                    event.preventDefault();
                    signOut();
                }}>
                    <IconLogout2 className={classes.linkIcon} stroke={1.5}/>
                    <span>Logout</span>
                </a>


            </div>
        </nav>
    );
}