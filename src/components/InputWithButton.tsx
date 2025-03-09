import {IconArrowRight, IconPlus} from '@tabler/icons-react';
import {ActionIcon, TextInput, TextInputProps, useMantineTheme} from '@mantine/core';
import {useState} from "react";

interface InputProps extends TextInputProps {
    sendMessage: (message: string) => void;
}

export function InputWithButton({sendMessage, ...props}: InputProps) {
    const theme = useMantineTheme();
    const [message, setMessage] = useState("");

    return (
        <form>

            <TextInput
                radius="xl"
                size="md"
                placeholder="Enter Message"
                rightSectionWidth={42}
                onChange={(e) => setMessage(e.currentTarget.value)}
                value={message}
                leftSection={<IconPlus size={18} stroke={1.5}/>}
                rightSection={
                    <ActionIcon type={"submit"} size={32} radius="xl" color={theme.primaryColor} variant="filled"
                                onClick={(event) => {
                                    event.preventDefault();
                                    sendMessage(message);
                                    setMessage("")
                                }}>
                        <IconArrowRight size={18} stroke={1.5}/>
                    </ActionIcon>
                }
                {...props}
            />
        </form>

    );
}