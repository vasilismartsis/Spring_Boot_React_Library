import { UserContext } from "./UserContext";
import UserList from "./UserList";
import { useUsers } from "./useUsers";

const User: React.FC = () => {
  const {
    totalUsers,
    users,
    userError,
    roles,
    roleError,
    roleRefetch,
    setCurrentPage,
    currentPage,
    userRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditUser,
    doAddUser,
    doDeleteUser,
    setSelectedRoles,
  } = useUsers();

  return (
    <>
      <h1 className="table-label">Users</h1>
      <UserContext.Provider
        value={{
          totalUsers,
          users,
          userError,
          roles,
          roleError,
          roleRefetch,
          setCurrentPage,
          currentPage,
          userRefetch,
          setSorterResult,
          setSearchColumn,
          setSearchValue,
          doEditUser,
          doAddUser,
          doDeleteUser,
          setSelectedRoles,
        }}
      >
        <UserList />
      </UserContext.Provider>
    </>
  );
};

export default User;
