import { Plus } from 'lucide-react';

const CreateNoteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-white transition-colors rounded-full cursor-pointer bg-primary-500 hover:bg-primary-700"
    >
      <Plus className="w-5 h-5" />
      <span className="font-medium">Create Notes</span>
    </button>
  );
};

export default CreateNoteButton;