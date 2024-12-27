import React from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import axiosInstance from "@/utils/axiosInstance";

const CreatePlaylistModal = ({ Modal, setModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    const createPlaylist = async () => {
        const response = await axiosInstance.post("/playlist", data);
        console.log(response.data);
    }
    setModal(false);
    createPlaylist();
  };

  if (!Modal) return null;

  return (
    <> 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-black p-6 rounded-lg w-full max-w-md border border-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">Create Playlist</h2>
            <button
              className="text-white bg-transparent hover:text-gray-400 hover:border-transparent focus:outline-none"
              onClick={() => setModal(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-white text-sm mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full bg-black border border-white text-white p-2 rounded focus:outline-none"
                id="name"
                type="text"
                placeholder="Enter playlist name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-2" htmlFor="description">
                Description
              </label>
              <input
                className="w-full bg-black border border-white text-white p-2 rounded focus:outline-none"
                id="description"
                type="text"
                placeholder="Enter playlist description"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 rounded hover:border-transparent focus:outline-none"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div> 
    </>
  );
};

export default CreatePlaylistModal;
