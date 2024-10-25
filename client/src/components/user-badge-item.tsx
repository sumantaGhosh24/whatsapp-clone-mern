import {FaTimes} from "react-icons/fa";

interface UserBadgeItemProps {
  user: {
    _id: string;
    name: string;
  };
  handleFunction: any;
  admin?: string;
}

const UserBadgeItem = ({user, handleFunction, admin}: UserBadgeItemProps) => {
  return (
    <div className="flex bg-green-700 text-white w-fit p-3 rounded-full capitalize items-center gap-1.5">
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <FaTimes onClick={handleFunction} className="cursor-pointer" />
    </div>
  );
};

export default UserBadgeItem;
