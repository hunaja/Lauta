import {
    LockClosedIcon,
    LogoutIcon,
    PencilIcon,
    UserAddIcon,
    XIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
import { Helmet } from "react-helmet";

import useStore from "../hooks/useAuthStore";
import roles from "../roles";
import { User, UserRole } from "../types";

import EditUserForm from "./forms/EditUserForm";
import ChangePasswordForm from "./forms/ChangePasswordForm";
import CreateUserForm from "./forms/CreateUserForm";
import FrontPageBox from "./FrontPageBox";
import FrontPageBoxHeader from "./FrontPageBoxHeader";
import FrontPageLayout from "./FrontPageLayout";
import useUsers from "../hooks/useUsers";

export default function DashboardPage() {
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingUsers, setEditingUsers] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const authorizedUser = useStore((state) => state.authorizedUser);
    const logout = useStore((state) => state.logout);
    const changePassword = useStore((state) => state.changePassword);

    const { users, create: createUser, update: editUser } = useUsers();

    if (!authorizedUser) return null;

    const toggleChangePassword = () => setEditingPassword(!editingPassword);
    const toggleEditingUsers = () => {
        if (creatingUser) {
            setCreatingUser(false);
            return;
        }

        if (editingUser) {
            setEditingUser(null);
            return;
        }

        setEditingUsers(!editingUsers);
    };
    const startCreatingUser = () => setCreatingUser(true);

    const editCallback = () => {
        setEditingUser(null);
    };

    return (
        <>
            <Helmet>
                <title>Hallintapaneeli</title>
            </Helmet>

            <FrontPageLayout>
                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>{`${roles[authorizedUser.role]} ${
                            authorizedUser.username
                        }`}</h3>

                        <div className="text-xs text-purple-400">
                            {!editingPassword && !editingUsers && (
                                <button
                                    className="underline mr-2 hover:text-purple-500"
                                    type="button"
                                    onClick={() => logout()}
                                >
                                    <LogoutIcon className="inline-block h-3 w-3" />
                                    Kirjaudu ulos
                                </button>
                            )}

                            <button
                                className="underline mr-2 hover:text-purple-500"
                                type="button"
                                onClick={() => toggleChangePassword()}
                            >
                                {!editingUsers &&
                                    (!editingPassword ? (
                                        <>
                                            <LockClosedIcon className="inline-block h-3 w-3" />
                                            Salasana
                                        </>
                                    ) : (
                                        <>
                                            <XIcon className="inline-block h-3 w-3" />
                                            Poistu
                                        </>
                                    ))}
                            </button>
                        </div>
                    </FrontPageBoxHeader>

                    {editingPassword && (
                        <div className="m-1 p-1 border-2 border-gray-100">
                            <h3 className="text-xl">Vaihda salasanasi</h3>
                            <ChangePasswordForm
                                changePassword={changePassword}
                            />
                        </div>
                    )}

                    <p>Tervetuloa Laudan hallintapaneeliin.</p>
                </FrontPageBox>

                {authorizedUser.role === UserRole.ADMIN && users && (
                    <FrontPageBox>
                        <FrontPageBoxHeader>
                            <h3>Käyttäjät</h3>

                            <div className="text-xs text-purple-400">
                                {editingUsers &&
                                    !editingUser &&
                                    !creatingUser && (
                                        <button
                                            className="underline mr-2 hover:text-purple-500"
                                            type="button"
                                            onClick={() => startCreatingUser()}
                                        >
                                            <UserAddIcon className="inline-block h-3 w-3" />
                                            Uusi
                                        </button>
                                    )}

                                <button
                                    className="underline mr-2 hover:text-purple-500"
                                    type="button"
                                    onClick={() => toggleEditingUsers()}
                                >
                                    {!editingPassword &&
                                        (!editingUsers ? (
                                            <>
                                                <PencilIcon className="inline-block h-3 w-3" />
                                                Muokkaa
                                            </>
                                        ) : (
                                            <>
                                                <XIcon className="inline-block h-3 w-3" />
                                                Poistu
                                            </>
                                        ))}
                                </button>
                            </div>
                        </FrontPageBoxHeader>

                        {creatingUser && (
                            <div className="m-1 p-1 border-2 border-gray-100">
                                <h3 className="text-xl">Lisää käyttäjä</h3>
                                <CreateUserForm createUser={createUser} />
                            </div>
                        )}

                        {editingUser && (
                            <div className="m-1 p-1 border-2 border-gray-100">
                                <h3 className="text-xl">{`Muokkaa käyttäjää ${editingUser.username}`}</h3>
                                <EditUserForm
                                    id={editingUser.id}
                                    defaultRole={editingUser.role}
                                    defaultUsername={editingUser.username}
                                    editUser={editUser}
                                    callback={editCallback}
                                />
                            </div>
                        )}

                        <table className="table-auto w-full">
                            <thead className="text-gray-400 text-sm">
                                <tr>
                                    <td>Nimi</td>
                                    <td>Rooli</td>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.username}</td>
                                        <td>{roles[u.role] ?? "Tuntematon"}</td>
                                        {editingUsers &&
                                            !editingUser &&
                                            !creatingUser &&
                                            u.role !== UserRole.ADMIN && (
                                                <td className="text-xs text-gray-400">
                                                    {" ["}
                                                    <button
                                                        type="button"
                                                        className="text-purple-400 hover:text-purple-500"
                                                        onClick={() =>
                                                            setEditingUser(u)
                                                        }
                                                    >
                                                        <PencilIcon className="inline-block h-3 w-3" />
                                                        Muokkaa
                                                    </button>
                                                    {" ]"}
                                                </td>
                                            )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </FrontPageBox>
                )}
            </FrontPageLayout>
        </>
    );
}
