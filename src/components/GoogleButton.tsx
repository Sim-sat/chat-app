import {Button, ButtonProps} from "@mantine/core";
import {GoogleIcon} from "./GoogleIcon.tsx";

export function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return <Button leftSection={<GoogleIcon/>} variant="default" {...props} />;
}