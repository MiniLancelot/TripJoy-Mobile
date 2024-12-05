import {user} from '@/utils/request';
import showError from '@/utils/showError';

const update_user = async (token: any, data: any) => {
    try {
        const result = await user("/users", {
            method: "PUT",
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            data: data
        });
        return result;
    } catch (error: any) {
        showError(error);
    }
};
export default update_user;