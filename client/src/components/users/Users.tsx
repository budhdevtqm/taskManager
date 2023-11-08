import React, { useEffect, useState } from "react";
import { getDate, getTime } from "../../common/utils";
import Footer from "../layout/Footer";
import { useAppSelector } from "redux/hooks";
import { deleteUser, fetchUsers } from "redux/userSlice";
import { RootState } from "../../redux/store";
import { MdDelete, MdEdit, MdInfo } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ViewUser from "./ViewUser";
import useFetch from "hooks/useFetch";
import useDelete from "hooks/useDelete";

export interface SigleUser {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: number;
  updatedAt?: number;
  _v?: number;
  otp?: number;
  isVerified?: boolean;
  status?: boolean;
  role?: string;
  otpCreatedAt?: number;
  otpExpireAt?: number;
  _id?: string;
}

const Users: React.FC = () => {
  const handleDelete = useDelete();
  const [user, setUser] = useState<SigleUser | null>(null);
  const [open, setOpen] = useState(false);
  const { handleFetch } = useFetch();
  const navigate = useNavigate();
  const users = useAppSelector(
    (state: RootState) => state.users.users
  ) as SigleUser[];

  const deleteHandler = async (id: string) => {
    await handleDelete(deleteUser, id);
    await handleFetch(fetchUsers);
  };

  const goToEdit = (id: String) => {
    navigate(`/users/update/${id}`);
  };

  useEffect(() => {
    handleFetch(fetchUsers);
  }, []);

  const viewUser = (user: SigleUser) => {
    setUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && <ViewUser open={open} setOpen={handleClose} userData={user} />}

      <div className="w-full min-h-full ">
        <div className="flex items-center justify-between px-8 py-4 ">
          <h1 className="font-bold text-primary text-[24px]">Users</h1>
          <button
            className="flex items-center gap-3 hover:bg-primary px-4 py-1 hover:text-white rounded text-primary border:primary bg-white border border-primary"
            type="button"
            onClick={() => navigate("/users/create")}
          >
            ADD
          </button>
        </div>
        <div className=" w-[90%] h-full my-4 mx-auto rounded-lg mb-4">
          {users && (
            <table className="min-w-full leading-normal shadow-xl">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Added On
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 font-semibold text-gray-700">
                    Permissions
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: SigleUser, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full border border-gray-500 rounded-full"
                            src="/images/user.png"
                            alt="user-logo"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-90handleFetch0 whitespace-no-wrap">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {getDate(user.createdAt)}
                      </p>
                      <p className="text-gray-600 whitespace-no-wrap">
                        {getTime(user.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {user.isVerified ? (
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">Yes</span>
                        </span>
                      ) : (
                        <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">No</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {user?.role}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <span className="flex text-[20px] gap-3 cursor-pointer">
                        <MdInfo title="Info" onClick={() => viewUser(user)} />
                        <MdEdit
                          title="Edit"
                          onClick={() => goToEdit(user._id as String)}
                        />
                        <MdDelete
                          title="Delete"
                          onClick={() => deleteHandler(user._id as string)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Toaster />
      </div>

      <Footer />
    </>
  );
};

export default Users;
