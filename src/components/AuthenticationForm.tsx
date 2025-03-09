import {
    Anchor,
    Button,
    Checkbox,
    Divider,
    Group,
    Paper,
    PaperProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {upperFirst, useToggle} from '@mantine/hooks';
import {GoogleButton} from './GoogleButton';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User as FirebaseUser,
} from "firebase/auth";
import {auth, db} from "../firebase.tsx";
import {useNavigate} from "react-router-dom";
import {collection, doc, getDocs, query, serverTimestamp, setDoc, where} from "firebase/firestore";
import {generateFromEmail, generateUsername} from "unique-username-generator";
import {standardProfilePicture} from "../config.tsx";


interface Props extends PaperProps {
    handleError: (error: Error) => void,
}

export function AuthenticationForm(props: Props) {
    const [type, toggle] = useToggle(['login', 'register']);

    const checkIfUserExists = async (name: string): Promise<boolean> => {
        const userQuery = query(
            collection(db, "users"),
            where("name", "==", name)
        )

        const querySnapshot = await getDocs(userQuery);
        return querySnapshot.size !== 0;
    }

    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async r => {
            if (r) {
                const name = r.user.displayName ? r.user.displayName : generateUsername();
                console.log(name);
                const exists = await checkIfUserExists(name)
                if (!exists) {
                    console.log("doesnt exist");
                    addUser(name, r.user.uid, r.user.email, r.user).then(() => {
                            navigate("/home");
                            window.location.reload();
                        }
                    );
                } else {
                    navigate("/home");
                    window.location.reload();
                }

            }
        });
    };

    const addUser = async (displayName: string | null, uid: string, email: string | null, user: FirebaseUser) => {
        let name = displayName;
        if (!name) {
            if (email) {
                name = generateFromEmail(email, 3)
            } else {
                name = generateUsername();
            }
        } else if (name.length === 1) {
            name = generateUsername();
        }
        await setDoc(doc(db, "users", uid), {
            name: name!,
            createdAt: serverTimestamp(),
            uid: uid,
            profilePicture: standardProfilePicture
        });
        await updateProfile(user, {displayName: name, photoURL: standardProfilePicture},);
    }

    const anonymSignIn = () => {
        signInAnonymously(auth).then((r) => {
            navigate("/home");
            addUser(null, r.user.uid, null, r.user).then(() => {
                console.log("Successfully logged in!");
                window.location.reload();
            });
        }).catch((error) => console.log(error))
    }

    return (
        <Paper radius="md" p="xl" withBorder {...props}>
            <Text size="lg" fw={500}>
                Welcome to Mantine, {type} with
            </Text>

            <Group grow mb="md" mt="md">
                <GoogleButton onClick={googleSignIn} radius="xl">Google</GoogleButton>
                <Button onClick={anonymSignIn} radius="xl">Anonym</Button>
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my="lg"/>

            <form onSubmit={form.onSubmit(() => {
                if (type === "register") {
                    createUserWithEmailAndPassword(auth, form.values.email, form.values.password)
                        .then((r) => {
                            addUser(form.values.name, r.user.uid, r.user.email, r.user).then(() => {
                                    console.log("Successfully logged in!");
                                }
                            ).then(() => {
                                navigate("/home");
                                window.location.reload();
                            });
                        }).catch((error) => console.log(error));
                } else
                    signInWithEmailAndPassword(auth, form.values.email, form.values.password).then(() => {
                        navigate("/home");
                        window.location.reload();
                    }).catch((error) => props.handleError(error));
            })}


            >
                <Stack>
                    {type === 'register' && (
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            radius="md"
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        placeholder="hello@mantine.dev"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    />

                    {type === 'register' && (
                        <Checkbox
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        />
                    )}
                </Stack>

                <Group justify="space-between" mt="xl">
                    <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {upperFirst(type)}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}