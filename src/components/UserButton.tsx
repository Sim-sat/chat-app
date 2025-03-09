import {IconChevronRight} from '@tabler/icons-react';
import {Avatar, Group, Text, UnstyledButton} from '@mantine/core';
import classes from './UserButton.module.css';
import {auth} from "../firebase.tsx";
import {Chat} from "../Types.tsx";
import {useEffect} from "react";

interface UserButtonProps {
    chat: Chat
    openChatWindow: (chat: Chat) => void;
    profilePicture: string;
}

export function UserButton(props: UserButtonProps) {

    useEffect(() => {
        console.log(props.chat);
        console.log(auth.currentUser?.displayName);
    }, []);

    return (
        <UnstyledButton className={classes.user} onClick={() => props.openChatWindow(props.chat)}>
            <Group>
                <Avatar
                    src={props.profilePicture}
                    radius="xl"
                />

                <div style={{flex: 1}}>
                    <Text size="sm" fw={500}>
                        {props.chat.participants[0] !== auth.currentUser?.displayName ? props.chat.participants[0] : props.chat.participants[1]}
                    </Text>

                </div>

                <IconChevronRight size={14} stroke={1.5}/>
            </Group>
        </UnstyledButton>
    );
}