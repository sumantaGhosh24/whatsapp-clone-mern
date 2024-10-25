interface UserListItemProps {
  user: {
    name: string;
    pic: string;
    email: string;
  };
  handleFunction: any;
}

const UserListItem = ({user, handleFunction}: UserListItemProps) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 bg-green-700 hover:bg-green-800 cursor-pointer rounded transition-colors my-2 p-3 mx-5"
    >
      <img alt={user.name} src={user.pic} className="h-16 w-16 rounded-full" />
      <div>
        <p className="text-white capitalize font-bold">{user.name}</p>
        <p className="text-white">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
