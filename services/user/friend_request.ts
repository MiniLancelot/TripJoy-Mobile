import {user} from "@/utils/request";

const get_friends_request = async (token: string) => {
    try {
        const res = await user.get("/users/friends/friendRequests", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const send_friend_request = async (token: string, UserId: string) => {
    try {
        const res = await user.post("/users/friends/send", {
            UserId: UserId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const revoke_friend_request = async (token: string, UserId: string) => {
    try {
        const res = await user.post("/users/friends/revoke", {
            UserId: UserId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const accept_friend_request = async (token: string, UserId: string) => {
    try {
        const res = await user.post("/users/friends/accept", {
            UserId: UserId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const decline_friend_request = async (token: string, UserId: string) => {
    try {
        const res = await user.post("/users/friends/decline", {
            UserId: UserId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const remove_friend = async (token: string, UserId: string) => {
    try {
        const res = await user.post("/users/friends/remove", {
            UserId: UserId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const sent_friend_requests = async (token: string, page: number, size: number) => {
    try {
        const res = await user.get("/users/friends/sent", {
            params: {
                page: page,
                size: size,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const get_friends = async (token: string) => {
    try {
        const res = await user.get("/users/friends/friends", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
}

export { get_friends_request, send_friend_request, revoke_friend_request, accept_friend_request, decline_friend_request, remove_friend, sent_friend_requests, get_friends };