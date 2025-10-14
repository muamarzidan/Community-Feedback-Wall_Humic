import { Plus } from 'lucide-react';

const CreateNoteButton = ({ onClick }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={onClick}
        className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">New Notes</span>
      </button>
    </div>
  );
};

export default CreateNoteButton;