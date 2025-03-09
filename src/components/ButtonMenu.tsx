import {IconDotsVertical, IconTrash,} from '@tabler/icons-react';
import {Button, Menu, useMantineTheme} from '@mantine/core';


interface Props {
    deleteChat: () => void;
}

export function ButtonMenu(props: Props) {
    const theme = useMantineTheme();


    return (
        <Menu
            transitionProps={{transition: 'pop-bottom-right'}}
            position="top-end"
            width={220}
            withinPortal
        >
            <Menu.Target>
                <Button variant="transparent" color="dark" rightSection={<IconDotsVertical size={30} stroke={1.5}/>}
                        pr={12}>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={props.deleteChat}
                           leftSection={<IconTrash size={20} color={theme.colors.red[6]} stroke={1.5}/>}
                >
                    Delete Chat
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}