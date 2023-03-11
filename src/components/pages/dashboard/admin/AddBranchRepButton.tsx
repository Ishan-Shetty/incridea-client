import Button from '@/src/components/button';
import { FC } from 'react';
import { IoAdd } from 'react-icons/io5';


const AddBranchRepButton: FC<{
    branchId: string;
    userId: string;
}> = ({ branchId, userId }) => {
    return (
        <Button 
            intent="success"
            size="medium"
            className="flex gap-1 items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={ () => console.log('Add Branch Rep') }
        >
            <IoAdd />
        </Button>
    )
};

export default AddBranchRepButton;
