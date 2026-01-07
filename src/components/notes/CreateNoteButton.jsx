import { Plus } from 'lucide-react';


const CreateNoteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-3 text-white transition-colors rounded-full cursor-pointer sm:px-4 bg-primary-500 hover:bg-primary-700"
    >
      <Plus className="w-6 h-6" />
      <span className="hidden font-medium sm:inline-block">Create Notes</span>
    </button>
  );
};

export default CreateNoteButton;