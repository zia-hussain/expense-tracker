import { useState } from "react";
import { Modal } from "@mui/material"; // Import Material-UI modal
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { auth, db } from "@/firebase/firebaseConfig";

const SalaryUpdateModal = ({ open, onClose, currentSalary }) => {
  const [newSalary, setNewSalary] = useState(currentSalary);

  const handleUpdateSalary = async () => {
    const userId = auth.currentUser.uid;

    try {
      await set(ref(db, `users/${userId}/salary`), newSalary);
      toast.success("Salary updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating salary:", error);
      toast.error("Error updating salary.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Update Salary
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <input
              type="number"
              name="salary"
              placeholder="Update Salary"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="w-1/2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSalary}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform ml-2"
            >
              Update Salary
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SalaryUpdateModal;
